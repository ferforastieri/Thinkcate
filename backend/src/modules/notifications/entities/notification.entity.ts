import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NotificationType {
  PUSH = 'push',
  EMAIL = 'email',
  IN_APP = 'in_app',
  SMS = 'sms',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read',
  CANCELLED = 'cancelled',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.IN_APP,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({ type: 'timestamp' })
  scheduledFor: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ length: 100, nullable: true })
  relatedModule: string; // 'calendar', 'notes', 'files', etc.

  @Column({ nullable: true })
  relatedId: number; // ID do item relacionado

  @Column({ length: 500, nullable: true })
  metadata: string; // JSON string for additional data

  @Column({ length: 500, nullable: true })
  tags: string; // Comma-separated tags

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ length: 50, nullable: true })
  recurrencePattern: string; // daily, weekly, monthly, yearly

  @Column({ type: 'timestamp', nullable: true })
  nextRecurrence: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
