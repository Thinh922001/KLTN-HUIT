import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentImgRepository, CommentRepository, ProductRepository, UsersRepository } from '../../repositories';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Transactional } from 'typeorm-transactional';
import {
  ProductsEntity,
  UserCommentEntity,
  UserCommentImagesEntity,
  UserEntity,
  UserReactionEntity,
} from '../../entities';
import { ErrorMessage } from '../../common/message';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommentDto, GetCommentDto } from './dto/get-comment.dto';
import { applyPagination, convertHttpToHttps, hidePhoneNumber } from '../../utils/utils';
import { UploadApiResponse } from 'cloudinary';
import { getTimeDifferenceFromNow } from '../../utils/date';
import { StatisticComment } from './dto/statistic-comment.dto';

@Injectable()
export class CommentService {
  productAlias: string;
  commentAlias: string;
  userAlias: string;
  commentImgAlias: string;
  userALias: string;
  userReactionAlias: string;
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
    this.userReactionAlias = UserReactionEntity.name;
  }

  @Transactional()
  async createComment(
    userId: number,
    { comment, rating, productId, phone, fullName }: CreateCommentDto,
    files: Express.Multer.File[]
  ) {
    const queryProduct = this.productRepo
      .createQueryBuilder(this.productAlias)
      .where(`${this.productAlias}.id = :productId`, { productId })
      .select([`${this.productAlias}.id`]);

    const queryUser = this.userRepo
      .createQueryBuilder(this.userAlias)
      .where(
        phone && fullName ? `${this.userAlias}.phone = :phone` : `${this.userAlias}.id = :userId`,
        phone ? { phone } : { userId }
      )
      .select([`${this.userAlias}.id`, `${this.userALias}.name`, `${this.userALias}.phone`]);

    let [product, user] = await Promise.all([queryProduct.getOne(), queryUser.getOne()]);

    if (!product) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (!user) {
      if (phone && fullName) {
        user = await this.userRepo.save(this.userRepo.create({ phone, name: fullName }));
      } else {
        throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
      }
    }

    const newComment = new UserCommentEntity();
    newComment.comment = comment;
    newComment.rating = rating;
    newComment.product = product;
    newComment.user = user;

    const commentSave = await this.commentRepo.save(newComment);

    let uploadResult: UploadApiResponse[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/comment'));
      uploadResult = await Promise.all(uploadPromises);

      const commentImgEntities = uploadResult.map((e) =>
        this.commentImgRepo.create({ image_url: e.url, publicId: e.public_id, comment: { id: commentSave.id } })
      );

      await this.commentImgRepo.save(commentImgEntities);
    }

    return {
      id: commentSave.id,
      comment: commentSave.comment,
      totalReaction: commentSave.totalReaction,
      rating: commentSave.rating,
      liked: false,
      time: getTimeDifferenceFromNow(commentSave.createdAt.toISOString()),
      img: uploadResult.length > 0 ? uploadResult.map((e) => convertHttpToHttps(e.url)) : [],
      owner: {
        id: user.id,
        aliasName: user?.name ? user.name : hidePhoneNumber(user.phone),
      },
    };
  }

  async getComment(user: UserEntity, { productId, take = 5, skip = 0 }: GetCommentDto) {
    const commentQuery = this.commentRepo
      .createQueryBuilder(this.commentAlias)
      .leftJoin(`${this.commentAlias}.images`, this.commentImgAlias)
      .leftJoin(`${this.commentAlias}.user`, this.userALias)
      .where(`${this.commentAlias}.product_id =:productId`, { productId })
      .select([
        `${this.commentAlias}.id`,
        `${this.commentAlias}.createdAt`,
        `${this.commentAlias}.comment`,
        `${this.commentAlias}.totalReaction`,
        `${this.commentAlias}.rating`,
        `${this.commentImgAlias}.id`,
        `${this.commentImgAlias}.image_url`,
        `${this.userALias}.id`,
        `${this.userALias}.name`,
        `${this.userALias}.phone`,
      ])
      .orderBy(`${this.commentAlias}.totalReaction`, 'DESC');

    if (user) {
      commentQuery
        .leftJoin(
          `${this.commentAlias}.userReaction`,
          this.userReactionAlias,
          `${this.commentAlias}.id = ${this.userReactionAlias}.comment_id AND ${this.userReactionAlias}.user_id =:userId`,
          { userId: user.id }
        )
        .addSelect([`${this.userReactionAlias}.id`]);
    }

    const { data, paging } = await applyPagination<UserCommentEntity>(commentQuery, take, skip);

    const result: CommentDto[] = data.map((e) => new CommentDto(e));

    return {
      data: result,
      paging: paging,
    };
  }

  async statisticComment({ productId }: StatisticComment) {
    const subQuery = this.commentRepo
      .createQueryBuilder(`${this.commentAlias}sub`)
      .where(`${this.commentAlias}sub.product_id = :productId`, { productId })
      .select(`COUNT(${this.commentAlias}sub.id)`);

    const queryResult = await this.commentRepo
      .createQueryBuilder(`${this.commentAlias}`)
      .where(`${this.commentAlias}.product_id = :productId`, { productId })
      .select([
        `ROUND(${this.commentAlias}.rating) as rating`,
        `ROUND(NULLIF(COUNT(${this.commentAlias}.rating), 0) / (${subQuery.getQuery()}) * 100) as ratingReaction`,
        `AVG(${this.commentAlias}.rating) as avgRating`,
      ])
      .setParameters({ productId })
      .groupBy(`${this.commentAlias}.rating`)
      .getRawMany<{ rating: number; ratingReaction: number; avgRating: number }>();

    const fullRatings = [1, 2, 3, 4, 5].map((rating) => {
      const existingRating = queryResult.find((item) => +item.rating === rating);
      return existingRating
        ? { rating: +existingRating.rating, ratingReaction: +existingRating.ratingReaction }
        : { rating, ratingReaction: 0 };
    });

    return {
      avgRating: queryResult.length > 0 ? +queryResult[0].avgRating : 0,
      ratings: fullRatings,
    };
  }
}
