import { Injectable } from '@nestjs/common';
import {
  InvoiceRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductDetailsRepository,
  ReturnOrderImgRepository,
  ReturnOrderRepository,
} from '../../repositories';
import {
  InvoiceEntity,
  OrderDetailEntity,
  OrderEntity,
  ProductDetailsEntity,
  ProductsEntity,
  ReturnOrderEntity,
  ReturnOrderImgEntity,
  UserEntity,
} from '../../entities';
import { ReturnOrderDto } from './dto/return-order.do';
import { Transactional } from 'typeorm-transactional';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { OrderReturnStatus, OrderStatus } from '../../types';
import { ChangeStatusReturnOrder } from './dto/change-status.dto';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { GetReturnOrder } from './dto/get-return-order.dto';
import { applyPagination } from '../../utils/utils';
import { ReturnOrderResponse } from './dto/get-return-order-res.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ReturnOrderService {
  orderAlias: string;
  returnOrderAlias: string;
  productDetailAlias: string;
  orderDetailAlias: string;
  userAlias: string;
  productdetailReturn: string;
  invoiceAlias: string;
  productAlias: string;
  returnOrderImgAlias: string;
  constructor(
    private readonly returnOrderRepo: ReturnOrderRepository,
    private readonly orderRepo: OrderRepository,
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly walleRepo: WalletsRepository,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly orderDetailRepo: OrderDetailRepository,
    private readonly returnOrderImgRepo: ReturnOrderImgRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {
    this.orderAlias = OrderEntity.name;
    this.returnOrderAlias = ReturnOrderEntity.name;
    this.productDetailAlias = ProductDetailsEntity.name;
    this.orderDetailAlias = OrderDetailEntity.name;
    this.userAlias = UserEntity.name;
    this.productdetailReturn = `${OrderDetailEntity.name}Return`;
    this.invoiceAlias = InvoiceEntity.name;
    this.productAlias = ProductsEntity.name;
    this.returnOrderImgAlias = ReturnOrderImgEntity.name;
  }

  @Transactional()
  async returnOrder(
    files: Express.Multer.File[],
    user: UserEntity,
    { orderId, productDetailId, quantity, reason }: ReturnOrderDto
  ) {
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

    if (order.invoices.every((e) => e.status !== 'PAID')) {
      throw new BadRequestException(ErrorMessage.USER_NOT_PAID_INVOICE);
    }

    if (order.status !== OrderStatus.Completed) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
    }

    if (!productDetail) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    const orderDetailFind = order.orderDetails.find((e) => e.sku.id == productDetailId);

    if (!orderDetailFind) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (quantity > orderDetailFind.quantity) {
      throw new BadRequestException(ErrorMessage.EXCEED_QUANTITY);
    }
    const returnOrder = await this.returnOrderRepo.save(
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

    if (files.length > 0) {
      const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/return-order'));

      const uploadResults = await Promise.all(uploadPromises);

      if (uploadResults.length > 0) {
        const returnOrderImgs = uploadResults.map((e) =>
          this.returnOrderImgRepo.create({
            publicId: e.public_id,
            img: e.url,
            returnOrder: {
              id: returnOrder.id,
            },
          })
        );

        await this.returnOrderImgRepo.save(returnOrderImgs);
      }
    }

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
        `${this.invoiceAlias}.id`,
        `${this.invoiceAlias}.status`,
        `${this.invoiceAlias}.total_amount`,
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
      const orderDetail = returnOrder.order.orderDetails.find((e) => e.sku.id === returnOrder.producDetail.id);
      const amount = Number(orderDetail.unit_price) * Number(returnOrder.quantity);
      this.walleRepo.update(
        { user: { id: returnOrder.user.id } },
        {
          balance: () => `balance + ${amount}`,
        }
      );
      // update amount invoice
      const invoiceUpdate = returnOrder.order.invoices.find((e) => e.status === 'PAID');
      await this.invoiceRepo.update(invoiceUpdate.id, {
        total_amount: () => `total_amount - ${amount}`,
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
        status: status,
      });

      // update orderDetail
      if (orderDetail.quantity <= returnOrder.quantity) {
        //delete orderDetail
        await this.orderDetailRepo.delete(orderDetail.id);
      } else {
        // update quantity order detail
        await this.orderDetailRepo.update(orderDetail.id, {
          quantity: orderDetail.quantity - returnOrder.quantity,
          total_price: amount,
        });
      }

      await this.orderRepo.update(returnOrder.order.id, {
        total_amount: () => `total_amount - ${amount}`,
      });
    }
  }

  async getReturnOrder({ status, take = 50, skip }: GetReturnOrder) {
    const query = this.returnOrderRepo
      .createQueryBuilder(this.returnOrderAlias)
      .withDeleted()
      .leftJoin(`${this.returnOrderAlias}.user`, `${this.userAlias}`)
      .leftJoin(`${this.returnOrderAlias}.producDetail`, this.productdetailReturn)
      .leftJoin(`${this.productdetailReturn}.product`, this.productAlias)
      .leftJoin(`${this.returnOrderAlias}.order`, this.orderAlias)
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.returnOrderAlias}.returnOrderImg`, this.returnOrderImgAlias)
      .select([
        `${this.returnOrderAlias}.id`,
        `${this.returnOrderAlias}.status`,
        `${this.returnOrderAlias}.isApprove`,
        `${this.returnOrderAlias}.reason`,
        `${this.returnOrderAlias}.quantity`,
        `${this.productdetailReturn}.id`,
        `${this.productdetailReturn}.price`,
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.userAlias}.id`,
        `${this.userAlias}.phone`,
        `${this.orderAlias}.id`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.unit_price`,
        `${this.productDetailAlias}.id`,
        `${this.returnOrderImgAlias}.id`,
        `${this.returnOrderImgAlias}.img`,
      ]);

    if (status) {
      query.where(`${this.returnOrderAlias}.status =:status`, { status });
    }

    const { data, paging } = await applyPagination<ReturnOrderEntity>(query, take, skip);

    const result: ReturnOrderResponse[] = data.map((e) => new ReturnOrderResponse(e));
    return {
      data: result,
      paging,
    };
  }
}
