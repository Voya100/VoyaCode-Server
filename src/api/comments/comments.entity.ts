import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments', { schema: 'public' })
export class Comment {
  @PrimaryGeneratedColumn() id: number;

  @Column('character varying', {
    nullable: false,
    length: 50,
    name: 'username'
  })
  username: string;

  @Column('text', {
    nullable: false,
    name: 'message'
  })
  message: string;

  @Column('boolean', {
    nullable: false,
    default: 'false',
    name: 'private'
  })
  private: boolean;

  @Column('character varying', {
    nullable: false,
    length: 45,
    name: 'ip'
  })
  ip: string;

  @Column('boolean', {
    nullable: false,
    default: 'false',
    name: 'deleted'
  })
  deleted: boolean;

  @Column('integer', {
    nullable: false,
    name: 'update_time'
  })
  update_time: number;

  @Column('integer', {
    nullable: false,
    name: 'post_time'
  })
  post_time: number;
}
