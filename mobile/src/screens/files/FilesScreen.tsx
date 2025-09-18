import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { filesService, File } from '../../services/files/filesService';
import Logo from '../../components/ui/Logo';

const { width, height } = Dimensions.get('window');

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
      {/* Header */}
      <View style={styles.header}>
        <Logo />
      </View>
      
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
    backgroundColor: '#F8F6F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6F0',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: width * 0.05,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.03,
    borderBottomWidth: 3,
    borderBottomColor: '#34495E',
    alignItems: 'center',
  },
  listContainer: {
    padding: width * 0.05,
  },
  fileCard: {
    backgroundColor: '#FFFFFF',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
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
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  fileName: {
    fontSize: width * 0.03,
    color: '#6C757D',
    marginTop: 2,
  },
  fileDescription: {
    fontSize: width * 0.035,
    color: '#495057',
    lineHeight: 20,
    marginBottom: width * 0.03,
  },
  fileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: width * 0.03,
    color: '#6C757D',
  },
  fileDate: {
    fontSize: width * 0.03,
    color: '#6C757D',
  },
  tagsContainer: {
    marginTop: width * 0.02,
  },
  tags: {
    fontSize: width * 0.03,
    color: '#9B59B6',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#6C757D',
    marginTop: width * 0.04,
    fontStyle: 'italic',
  },
  emptySubtext: {
    fontSize: width * 0.035,
    color: '#BDC3C7',
    marginTop: width * 0.02,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: height * 0.025,
    right: width * 0.05,
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: '#9B59B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
