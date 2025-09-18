import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Notification[]; total: number }> {
    const [data, total] = await this.notificationsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { scheduledFor: 'ASC' },
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    await this.notificationsRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notificationsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Notification not found');
    }
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.notificationsRepository.update(id, {
      isRead: true,
      readAt: new Date(),
    });
    return this.findOne(id);
  }

  async markAsSent(id: number): Promise<Notification> {
    await this.notificationsRepository.update(id, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });
    return this.findOne(id);
  }

  async markAsFailed(id: number): Promise<Notification> {
    await this.notificationsRepository.update(id, {
      status: NotificationStatus.FAILED,
    });
    return this.findOne(id);
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: {
        status: NotificationStatus.PENDING,
        scheduledFor: LessThan(new Date()),
      },
      order: { priority: 'DESC', scheduledFor: 'ASC' },
    });
  }

  async getUpcomingNotifications(hours: number = 24): Promise<Notification[]> {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.notificationsRepository.find({
      where: {
        status: NotificationStatus.PENDING,
        scheduledFor: Between(now, future),
      },
      order: { scheduledFor: 'ASC' },
    });
  }

  async getNotificationsByModule(module: string, relatedId?: number): Promise<Notification[]> {
    const where: any = { relatedModule: module };
    if (relatedId) {
      where.relatedId = relatedId;
    }

    return this.notificationsRepository.find({
      where,
      order: { scheduledFor: 'DESC' },
    });
  }

  async getUnreadCount(): Promise<number> {
    return this.notificationsRepository.count({
      where: { isRead: false },
    });
  }

  async search(query: string): Promise<Notification[]> {
    return this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.title LIKE :query OR notification.message LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('notification.scheduledFor', 'DESC')
      .getMany();
  }

  async getByPriority(priority: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { priority: priority as any },
      order: { scheduledFor: 'ASC' },
    });
  }

  async getByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { type },
      order: { scheduledFor: 'ASC' },
    });
  }
}
