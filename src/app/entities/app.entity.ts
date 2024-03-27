import { Exclude } from 'class-transformer';
import { Publisher } from '../../publisher/entities/publisher.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export type AppExtra = {
  image?: string;
};

@Entity()
@Unique('app-name', ['name'])
export class App extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({
    generated: 'uuid',
    unique: true,
    // select: false,
    nullable: false,
  })
  key: string;

  @Column({
    nullable: false,
    length: 250,
  })
  name: string;

  @Column({
    nullable: false,
    length: 250,
  })
  description: string;

  @Column({
    nullable: false,
    unique: true,
    length: 250,
  })
  url: string;

  @Column('simple-json', { nullable: false, default: '{}' })
  extra: AppExtra;

  @ManyToOne(() => Publisher, (p) => p.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;
}
