import { Transform } from 'class-transformer';
import { IsString, Length, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('comments', { schema: 'public' })
export class Comment {
  @PrimaryGeneratedColumn() id: number;

  @IsString({ message: 'Username must be a string.' })
  @Transform(value => value.trim())
  @Length(4, 15, {
    message: 'Username must be $constraint1 - $constraint2 characters long.'
  })
  @Column({
    type: 'varchar',
    length: 50
  })
  username: string;

  @MinLength(4, {
    message: 'Message must be longer than $constraint1 characters.'
  })
  @Column()
  message: string;

  @Column({
    name: 'private',
    default: 'false'
  })
  isPrivate: boolean;

  @Column({
    name: 'deleted',
    default: 'false'
  })
  isDeleted: boolean;

  @UpdateDateColumn({
    name: 'update_time'
  })
  updateTime: Date;

  @CreateDateColumn({
    name: 'post_time'
  })
  postTime: Date;
}
