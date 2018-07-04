import { Column, Entity } from 'typeorm';

@Entity('blogs', { schema: 'public' })
export class Blog {
  @Column('integer', {
    generated: true,
    nullable: false,
    primary: true,
    name: 'id'
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'name'
  })
  name: string;

  @Column('text', {
    nullable: false,
    name: 'text'
  })
  text: string;

  @Column('timestamp without time zone', {
    nullable: false,
    default: 'now()',
    name: 'date'
  })
  date: Date;
}
