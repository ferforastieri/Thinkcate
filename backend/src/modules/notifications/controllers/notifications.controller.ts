import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { NotificationType } from '../entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.notificationsService.findAll(page, limit);
  }

  @Get('pending')
  getPendingNotifications() {
    return this.notificationsService.getPendingNotifications();
  }

  @Get('upcoming')
  getUpcomingNotifications(
    @Query('hours', new ParseIntPipe({ optional: true })) hours: number = 24,
  ) {
    return this.notificationsService.getUpcomingNotifications(hours);
  }

  @Get('unread-count')
  getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.notificationsService.search(query);
  }

  @Get('priority/:priority')
  getByPriority(@Param('priority') priority: string) {
    return this.notificationsService.getByPriority(priority);
  }

  @Get('type/:type')
  getByType(@Param('type') type: NotificationType) {
    return this.notificationsService.getByType(type);
  }

  @Get('module/:module')
  getByModule(
    @Param('module') module: string,
    @Query('relatedId', new ParseIntPipe({ optional: true })) relatedId?: number,
  ) {
    return this.notificationsService.getNotificationsByModule(module, relatedId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/sent')
  markAsSent(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsSent(id);
  }

  @Patch(':id/failed')
  markAsFailed(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsFailed(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.remove(id);
  }
}
