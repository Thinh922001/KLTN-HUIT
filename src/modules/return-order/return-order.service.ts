import { Injectable } from '@nestjs/common';
import {
  InvoiceRepository,
  OrderRepository,
  ProductDetailsRepository,
  ReturnOrderRepository,
} from '../../repositories';
import {
  InvoiceEntity,
  OrderDetailEntity,
  OrderEntity,
  ProductDetailsEntity,
  ReturnOrderEntity,
  UserEntity,
} from '../../entities';
import { ReturnOrderDto } from './dto/return-order.do';
import { Transactional } from 'typeorm-transactional';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { OrderReturnStatus, OrderStatus } from '../../types';
import { ChangeStatusReturnOrder } from './dto/change-status.dto';
import { WalletsRepository } from '../../repositories/wallets.repository';

@Injectable()
export class ReturnOrderService {
  orderAlias: string;
  returnOrderAlias: string;
  productDetailAlias: string;
  orderDetailAlias: string;
  userAlias: string;
  productdetailReturn: string;
  invoiceAlias: string;
  constructor(
    private readonly returnOrderRepo: ReturnOrderRepository,
    private readonly orderRepo: OrderRepository,
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly walleRepo: WalletsRepository,
    private readonly invoiceRepo: InvoiceRepository
  ) {
    this.orderAlias = OrderEntity.name;
    this.returnOrderAlias = ReturnOrderEntity.name;
    this.productDetailAlias = ProductDetailsEntity.name;
    this.orderDetailAlias = OrderDetailEntity.name;
    this.userAlias = UserEntity.name;
    this.productdetailReturn = `${OrderDetailEntity.name}Return`;
    this.invoiceAlias = InvoiceEntity.name;
  }

  @Transactional()
  async returnOrder(user: UserEntity, { orderId, productDetailId, quantity, reason }: ReturnOrderDto) {
    const [order, productDetail] = await Promise.all([
      this.orderRepo
        .createQueryBuilder(this.orderAlias)
        .where(`${this.orderAlias}.id =:orderId`, { orderId })
        .leftJoin(`${this.orderAlias}.invoices`, this.invoiceAlias)
        .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
        .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
        .select([
          `${this.orderAlias}.id`,
          `${this.orderAlias}.status`,
          `${this.invoiceAlias}.id`,
          `${this.invoiceAlias}.status`,
          `${this.orderDetailAlias}.id`,
          `${this.orderDetailAlias}.quantity`,
          `${this.productDetailAlias}.id`,
        ])
        .getOne(),
      this.productDetailRepo
        .createQueryBuilder(this.productDetailAlias)
        .where(`${this.productDetailAlias}.id =:productDetailId`, { productDetailId })
        .select([`${this.productDetailAlias}.id`])
        .getOne(),
    ]);
    if (!order) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (order.invoices.some((e) => e.status !== 'PAID')) {
      throw new BadRequestException(ErrorMessage.USER_NOT_PAID_INVOICE);
    }

    if (order.status !== OrderStatus.Completed) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
    }

    if (!productDetail) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    const orderDetailFind = order.orderDetails.find((e) => e.sku.id === productDetailId);

    if (quantity > orderDetailFind.quantity) {
      throw new BadRequestException(ErrorMessage.EXCEED_QUANTITY);
    }
    await this.returnOrderRepo.save(
      this.returnOrderRepo.create({
        order: { id: orderId },
        user: { id: user.id },
        producDetail: { id: productDetailId },
        isApprove: false,
        quantity,
        reason,
        status: OrderReturnStatus.Pending,
      })
    );

    return [];
  }

  @Transactional()
  async changeStatusOrderReturn({ status, id }: ChangeStatusReturnOrder) {
    const returnOrder = await this.returnOrderRepo
      .createQueryBuilder(this.returnOrderAlias)
      .where(`${this.returnOrderAlias}.id =:id`, { id })
      .leftJoin(`${this.returnOrderAlias}.order`, this.orderAlias)
      .leftJoin(`${this.orderAlias}.invoices`, this.invoiceAlias)
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.returnOrderAlias}.user`, this.userAlias)
      .leftJoin(`${this.returnOrderAlias}.producDetail`, `${this.productdetailReturn}`)
      .select([
        `${this.returnOrderAlias}.id`,
        `${this.returnOrderAlias}.status`,
        `${this.returnOrderAlias}.isApprove`,
        `${this.returnOrderAlias}.quantity`,
        `${this.orderAlias}.id`,
        `${this.orderAlias}.total_amount`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.quantity`,
        `${this.orderDetailAlias}.unit_price`,
        `${this.orderDetailAlias}.total_price`,
        `${this.userAlias}.id`,
        `${this.productdetailReturn}.id`,
        `${this.productDetailAlias}.id`,
      ])
      .getOne();

    if (returnOrder.status === OrderReturnStatus.Rejected || returnOrder.status === OrderReturnStatus.Resolved) {
      throw new BadRequestException(ErrorMessage.ORDER_RETURN_STATUS_CANNOT_UPDATE);
    }

    if (status === OrderReturnStatus.Rejected) {
      await this.returnOrderRepo.update(id, {
        status: OrderReturnStatus.Rejected,
        isApprove: false,
      });
    }

    if (status === OrderReturnStatus.Resolved) {
      // refund wallet
      const productDetail = returnOrder.order.orderDetails.find((e) => e.sku.id === returnOrder.producDetail.id);
      const amount = Number(productDetail.unit_price) * Number(returnOrder.quantity);
      this.walleRepo.update(
        { user: { id: returnOrder.user.id } },
        {
          balance: () => `balance + ${amount}`,
        }
      );
      // update amount invoice
      const invoiceUpdate = returnOrder.order.invoices.find((e) => e.status === 'PAID');
      await this.invoiceRepo.update(invoiceUpdate.id, {
        total_amount: () => `total_amont - ${amount}`,
      });
      await this.invoiceRepo.save(
        this.invoiceRepo.create({
          total_amount: amount,
          status: 'RETURN',
          payment_method: 'RETURN',
          order: { id: returnOrder.order.id },
          customer: { id: returnOrder.user.id },
        })
      );

      await this.returnOrderRepo.update(id, {
        isApprove: true,
      });
    }
  }
}
