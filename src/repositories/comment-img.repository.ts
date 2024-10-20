import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCommentImagesEntity } from '../entities';

@Injectable()
export class CommentImgRepository extends Repository<UserCommentImagesEntity> {
  constructor(private dataSource: DataSource) {
    super(UserCommentImagesEntity, dataSource.createEntityManager());
  }
}
