import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.calendarService.create(createEventDto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.calendarService.findAll(page, limit);
  }

  @Get('date-range')
  getEventsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.calendarService.getEventsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('type/:type')
  getEventsByType(@Param('type') type: string) {
    return this.calendarService.getEventsByType(type);
  }

  @Get('upcoming')
  getUpcomingEvents(
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 7,
  ) {
    return this.calendarService.getUpcomingEvents(days);
  }

  @Get('today')
  getTodaysEvents() {
    return this.calendarService.getTodaysEvents();
  }

  @Get('favorites')
  getFavorites() {
    return this.calendarService.getFavorites();
  }

  @Get('recurring')
  getRecurringEvents() {
    return this.calendarService.getRecurringEvents();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.calendarService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.calendarService.update(id, updateEventDto);
  }

  @Patch(':id/complete')
  markAsCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.markAsCompleted(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.remove(id);
  }
}
