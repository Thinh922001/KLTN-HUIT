import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentImgRepository, CommentRepository, ProductRepository, UsersRepository } from '../../repositories';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Transactional } from 'typeorm-transactional';
import { ProductsEntity, UserCommentEntity, UserCommentImagesEntity, UserEntity } from '../../entities';
import { ErrorMessage } from '../../common/message';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommentDto, GetCommentDto } from './dto/get-comment.dto';

@Injectable()
export class CommentService {
  productAlias: string;
  commentAlias: string;
  userAlias: string;
  commentImgAlias: string;
  userALias: string;
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly productRepo: ProductRepository,
    private readonly userRepo: UsersRepository,
    private readonly commentImgRepo: CommentImgRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {
    this.productAlias = ProductsEntity.name;
    this.commentAlias = UserCommentEntity.name;
    this.userAlias = UserEntity.name;
    this.commentImgAlias = UserCommentImagesEntity.name;
    this.userALias = UserEntity.name;
  }

  @Transactional()
  async createComment(userId: number, { comment, rating, productId }: CreateCommentDto, files: Express.Multer.File[]) {
    const queryProduct = this.productRepo
      .createQueryBuilder(this.productAlias)
      .where(`${this.productAlias}.id =:productId`, { productId })
      .select([`${this.productAlias}.id`]);

    const queryUser = this.userRepo
      .createQueryBuilder(this.userAlias)
      .where(`${this.userAlias}.id =:userId`, { userId })
      .select([`${this.userAlias}.id`]);

    const [product, user] = await Promise.all([queryProduct.getOne(), queryUser.getOne()]);

    if (!product) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (!user) {
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
    }

    const newComment = new UserCommentEntity();
    newComment.comment = comment;
    newComment.rating = rating;
    newComment.product = product;
    newComment.user = user;

    const commentSave = await this.commentRepo.save(newComment);

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/comment'));
      const uploadResult = await Promise.all(uploadPromises);

      const commentImgEntities = uploadResult.map((e) =>
        this.commentImgRepo.create({ image_url: e.url, publicId: e.public_id, comment: { id: commentSave.id } })
      );

      await this.commentImgRepo.save(commentImgEntities);
    }

    return [];
  }

  async getComment({ productId, take = 5, skip = 0 }: GetCommentDto) {
    const comment = await this.commentRepo
      .createQueryBuilder(this.commentAlias)
      .leftJoinAndSelect(`${this.commentAlias}.images`, this.commentImgAlias)
      .leftJoinAndSelect(`${this.commentAlias}.user`, this.userALias)
      .where(`${this.commentAlias}.product_id =:productId`, { productId })
      .take(take)
      .skip(skip)
      .select([
        `${this.commentAlias}.id`,
        `${this.commentAlias}.comment`,
        `${this.commentAlias}.totalReaction`,
        `${this.commentAlias}.rating`,
        `${this.commentImgAlias}.id`,
        `${this.commentImgAlias}.image_url`,
        `${this.userALias}.id`,
        `${this.userALias}.name`,
        `${this.userALias}.phone`,
      ])
      .orderBy(`${this.commentAlias}.totalReaction`, 'DESC')
      .getMany();

    if (comment.length > 0) {
      return comment.map((e) => new CommentDto(e));
    }

    return [];
  }
}
