import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blogs', { schema: 'public' })
export class BlogEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'name'
  })
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(255, {
    message: "Name can't be longer than  $constraint1 characters."
  })
  name: string;

  @Column('text', {
    nullable: false,
    name: 'text'
  })
  @IsString({ message: 'Text must be a string.' })
  @IsNotEmpty({ message: 'Text content is required.' })
  text: string;

  @Column('timestamp without time zone', {
    nullable: false,
    default: 'now()',
    name: 'date'
  })
  date: Date;
}
