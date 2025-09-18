import api from './api';

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tags?: string;
  isFavorite?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string;
  isFavorite?: boolean;
}

export const notesService = {
  // Buscar todas as notas
  async getAll(page: number = 1, limit: number = 10) {
    const response = await api.get(`/notes?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Buscar nota por ID
  async getById(id: number) {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Criar nova nota
  async create(data: CreateNoteData) {
    const response = await api.post('/notes', data);
    return response.data;
  },

  // Atualizar nota
  async update(id: number, data: UpdateNoteData) {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data;
  },

  // Deletar nota
  async delete(id: number) {
    await api.delete(`/notes/${id}`);
  },

  // Buscar notas
  async search(query: string) {
    const response = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Buscar favoritos
  async getFavorites() {
    const response = await api.get('/notes/favorites');
    return response.data;
  },
};
