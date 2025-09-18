import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event, EventStatus } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Event[]; total: number }> {
    const [data, total] = await this.eventsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { startDate: 'ASC' },
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.eventsRepository.update(id, updateEventDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Event not found');
    }
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        startDate: Between(startDate, endDate),
      },
      order: { startDate: 'ASC' },
    });
  }

  async getEventsByType(type: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { type: type as any },
      order: { startDate: 'ASC' },
    });
  }

  async getUpcomingEvents(days: number = 7): Promise<Event[]> {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.eventsRepository.find({
      where: {
        startDate: Between(now, future),
        status: EventStatus.PENDING,
      },
      order: { startDate: 'ASC' },
    });
  }

  async getTodaysEvents(): Promise<Event[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return this.eventsRepository.find({
      where: {
        startDate: Between(startOfDay, endOfDay),
      },
      order: { startDate: 'ASC' },
    });
  }

  async getFavorites(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { isFavorite: true },
      order: { startDate: 'ASC' },
    });
  }

  async search(query: string): Promise<Event[]> {
    return this.eventsRepository
      .createQueryBuilder('event')
      .where('event.title LIKE :query OR event.description LIKE :query OR event.tags LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  async markAsCompleted(id: number): Promise<Event> {
    await this.eventsRepository.update(id, {
      status: EventStatus.COMPLETED,
    });
    return this.findOne(id);
  }

  async getRecurringEvents(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { isRecurring: true },
      order: { startDate: 'ASC' },
    });
  }
}
