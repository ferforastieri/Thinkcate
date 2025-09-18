import api from '../../lib/api';

export interface File {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  title: string;
  description?: string;
  tags?: string;
  isFavorite: boolean;
  extractedText?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFileData {
  title: string;
  description?: string;
  tags?: string;
  isFavorite?: boolean;
}

export interface UpdateFileData {
  title?: string;
  description?: string;
  tags?: string;
  isFavorite?: boolean;
}

export const filesService = {
  // Buscar todos os arquivos
  async getAll(page: number = 1, limit: number = 10) {
    const response = await api.get(`/files?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Buscar arquivo por ID
  async getById(id: number) {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  // Upload de arquivo
  async upload(file: any, data: CreateFileData) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.tags) formData.append('tags', data.tags);
    if (data.isFavorite) formData.append('isFavorite', data.isFavorite.toString());

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Atualizar arquivo
  async update(id: number, data: UpdateFileData) {
    const response = await api.patch(`/files/${id}`, data);
    return response.data;
  },

  // Deletar arquivo
  async delete(id: number) {
    await api.delete(`/files/${id}`);
  },

  // Buscar arquivos
  async search(query: string) {
    const response = await api.get(`/files/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Buscar favoritos
  async getFavorites() {
    const response = await api.get('/files/favorites');
    return response.data;
  },

  // Buscar por tipo
  async getByType(type: string) {
    const response = await api.get(`/files/type/${type}`);
    return response.data;
  },
};
