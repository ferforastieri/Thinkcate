import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  originalFilename: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 50 })
  fileType: string;

  @Column()
  fileSize: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  tags: string;

  @Column({ default: false })
  isFavorite: boolean;

  @Column('text', { nullable: true })
  extractedText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
