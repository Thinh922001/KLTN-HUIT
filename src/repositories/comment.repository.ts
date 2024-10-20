import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCommentEntity } from '../entities';

@Injectable()
export class CommentRepository extends Repository<UserCommentEntity> {
  constructor(private dataSource: DataSource) {
    super(UserCommentEntity, dataSource.createEntityManager());
  }
}
