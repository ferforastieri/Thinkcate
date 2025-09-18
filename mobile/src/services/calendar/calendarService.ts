import api from '../../lib/api';

export interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  reminderDate?: string;
  type: 'task' | 'reminder' | 'birthday' | 'event';
  status: 'pending' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrencePattern?: string;
  tags?: string;
  isFavorite: boolean;
  isAllDay: boolean;
  color?: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  reminderDate?: string;
  type?: 'task' | 'reminder' | 'birthday' | 'event';
  status?: 'pending' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  recurrencePattern?: string;
  tags?: string;
  isFavorite?: boolean;
  isAllDay?: boolean;
  color?: string;
  location?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  reminderDate?: string;
  type?: 'task' | 'reminder' | 'birthday' | 'event';
  status?: 'pending' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  recurrencePattern?: string;
  tags?: string;
  isFavorite?: boolean;
  isAllDay?: boolean;
  color?: string;
  location?: string;
}

export const calendarService = {
  // Buscar todos os eventos
  async getAll(page: number = 1, limit: number = 10) {
    const response = await api.get(`/calendar?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Buscar evento por ID
  async getById(id: number) {
    const response = await api.get(`/calendar/${id}`);
    return response.data;
  },

  // Criar novo evento
  async create(data: CreateEventData) {
    const response = await api.post('/calendar', data);
    return response.data;
  },

  // Atualizar evento
  async update(id: number, data: UpdateEventData) {
    const response = await api.patch(`/calendar/${id}`, data);
    return response.data;
  },

  // Deletar evento
  async delete(id: number) {
    await api.delete(`/calendar/${id}`);
  },

  // Buscar eventos por período
  async getByDateRange(startDate: string, endDate: string) {
    const response = await api.get(`/calendar/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Buscar eventos de hoje
  async getToday() {
    const response = await api.get('/calendar/today');
    return response.data;
  },

  // Buscar próximos eventos
  async getUpcoming(days: number = 7) {
    const response = await api.get(`/calendar/upcoming?days=${days}`);
    return response.data;
  },

  // Buscar por tipo
  async getByType(type: string) {
    const response = await api.get(`/calendar/type/${type}`);
    return response.data;
  },

  // Buscar favoritos
  async getFavorites() {
    const response = await api.get('/calendar/favorites');
    return response.data;
  },

  // Buscar recorrentes
  async getRecurring() {
    const response = await api.get('/calendar/recurring');
    return response.data;
  },

  // Buscar eventos
  async search(query: string) {
    const response = await api.get(`/calendar/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Marcar como concluído
  async markAsCompleted(id: number) {
    const response = await api.patch(`/calendar/${id}/complete`);
    return response.data;
  },
};
