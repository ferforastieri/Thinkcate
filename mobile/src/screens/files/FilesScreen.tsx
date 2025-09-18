import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { filesService, File } from '../../services/files/filesService';

export default function FilesScreen() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await filesService.getAll();
      setFiles(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os arquivos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'document-text';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'grid';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('text')) return 'document';
    return 'document';
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return '#FF3B30';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '#34C759';
    if (fileType.includes('image')) return '#FF9500';
    if (fileType.includes('text')) return '#007AFF';
    return '#8E8E93';
  };

  const renderFile = ({ item }: { item: File }) => (
    <TouchableOpacity style={styles.fileCard}>
      <View style={styles.fileHeader}>
        <View style={styles.fileIconContainer}>
          <Ionicons 
            name={getFileTypeIcon(item.fileType)} 
            size={24} 
            color={getFileTypeColor(item.fileType)} 
          />
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileTitle}>{item.title}</Text>
          <Text style={styles.fileName}>{item.originalFilename}</Text>
        </View>
        {item.isFavorite && (
          <Ionicons name="heart" size={20} color="#FF3B30" />
        )}
      </View>
      
      {item.description && (
        <Text style={styles.fileDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.fileFooter}>
        <Text style={styles.fileSize}>{formatFileSize(item.fileSize)}</Text>
        <Text style={styles.fileDate}>{formatDate(item.createdAt)}</Text>
      </View>
      
      {item.tags && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tags}>{item.tags}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando arquivos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        renderItem={renderFile}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum arquivo encontrado</Text>
            <Text style={styles.emptySubtext}>Toque no + para fazer upload do seu primeiro arquivo</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  fileCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fileName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  fileDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  fileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#999',
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    marginTop: 8,
  },
  tags: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
