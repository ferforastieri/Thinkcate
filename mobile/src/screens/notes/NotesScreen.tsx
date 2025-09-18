import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notesService, Note } from '../../services/notes/notesService';
import Logo from '../../components/ui/Logo';

const { width, height } = Dimensions.get('window');

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesService.getAll();
      setNotes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as notas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        {item.isFavorite && (
          <Ionicons name="heart" size={20} color="#FF3B30" />
        )}
      </View>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content || 'Sem conteúdo'}
      </Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
        {item.tags && (
          <Text style={styles.noteTags}>{item.tags}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando notas...</Text>
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
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma nota encontrada</Text>
            <Text style={styles.emptySubtext}>Toque no + para criar sua primeira nota</Text>
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
  noteCard: {
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
    borderLeftColor: '#3498DB',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  noteContent: {
    fontSize: width * 0.035,
    color: '#495057',
    lineHeight: 20,
    marginBottom: width * 0.03,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: width * 0.03,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  noteTags: {
    fontSize: width * 0.03,
    color: '#3498DB',
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
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
