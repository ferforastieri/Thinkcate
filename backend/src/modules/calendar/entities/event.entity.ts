import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EventType {
  TASK = 'task',
  REMINDER = 'reminder',
  BIRTHDAY = 'birthday',
  EVENT = 'event',
}

export enum EventStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ type: 'datetime', nullable: true })
  reminderDate: Date;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.TASK,
  })
  type: EventType;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ length: 50, nullable: true })
  recurrencePattern: string; // daily, weekly, monthly, yearly

  @Column({ length: 500, nullable: true })
  tags: string;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ default: false })
  isAllDay: boolean;

  @Column({ length: 7, nullable: true })
  color: string; // Hex color for calendar display

  @Column({ length: 500, nullable: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
