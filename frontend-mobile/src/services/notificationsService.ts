import api from './api';

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: 'push' | 'email' | 'in_app' | 'sms';
  status: 'pending' | 'sent' | 'failed' | 'read' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor: string;
  sentAt?: string;
  readAt?: string;
  isRead: boolean;
  relatedModule?: string;
  relatedId?: number;
  metadata?: string;
  tags?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  nextRecurrence?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNotificationData {
  title: string;
  message?: string;
  type?: 'push' | 'email' | 'in_app' | 'sms';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor: string;
  relatedModule?: string;
  relatedId?: number;
  metadata?: string;
  tags?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export interface UpdateNotificationData {
  title?: string;
  message?: string;
  type?: 'push' | 'email' | 'in_app' | 'sms';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: string;
  relatedModule?: string;
  relatedId?: number;
  metadata?: string;
  tags?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export const notificationsService = {
  // Buscar todas as notificações
  async getAll(page: number = 1, limit: number = 10) {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Buscar notificação por ID
  async getById(id: number) {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Criar nova notificação
  async create(data: CreateNotificationData) {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  // Atualizar notificação
  async update(id: number, data: UpdateNotificationData) {
    const response = await api.patch(`/notifications/${id}`, data);
    return response.data;
  },

  // Deletar notificação
  async delete(id: number) {
    await api.delete(`/notifications/${id}`);
  },

  // Buscar notificações pendentes
  async getPending() {
    const response = await api.get('/notifications/pending');
    return response.data;
  },

  // Buscar próximas notificações
  async getUpcoming(hours: number = 24) {
    const response = await api.get(`/notifications/upcoming?hours=${hours}`);
    return response.data;
  },

  // Contar não lidas
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Buscar por módulo
  async getByModule(module: string, relatedId?: number) {
    const url = relatedId 
      ? `/notifications/module/${module}?relatedId=${relatedId}`
      : `/notifications/module/${module}`;
    const response = await api.get(url);
    return response.data;
  },

  // Buscar por prioridade
  async getByPriority(priority: string) {
    const response = await api.get(`/notifications/priority/${priority}`);
    return response.data;
  },

  // Buscar por tipo
  async getByType(type: string) {
    const response = await api.get(`/notifications/type/${type}`);
    return response.data;
  },

  // Buscar notificações
  async search(query: string) {
    const response = await api.get(`/notifications/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Marcar como lida
  async markAsRead(id: number) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Marcar como enviada
  async markAsSent(id: number) {
    const response = await api.patch(`/notifications/${id}/sent`);
    return response.data;
  },

  // Marcar como falhou
  async markAsFailed(id: number) {
    const response = await api.patch(`/notifications/${id}/failed`);
    return response.data;
  },
};
