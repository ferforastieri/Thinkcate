import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notesService, Note } from '../../services/notes/notesService';
import { calendarService, Event } from '../../services/calendar/calendarService';

export default function HomeScreen() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      const [notesData, eventsData] = await Promise.all([
        notesService.getAll(1, 5),
        calendarService.getToday(),
      ]);

      setRecentNotes(notesData.data || []);
      setTodayEvents(eventsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thinkcate</Text>
        <Text style={styles.headerSubtitle}>Seu bloco de notas pessoal</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.statNumber}>{recentNotes.length}</Text>
          <Text style={styles.statLabel}>Notas</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#34C759" />
          <Text style={styles.statNumber}>{todayEvents.length}</Text>
          <Text style={styles.statLabel}>Eventos Hoje</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#FF9500" />
          <Text style={styles.statNumber}>{todayEvents.length}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
      </View>

      {/* Recent Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas Recentes</Text>
        {recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <TouchableOpacity key={note.id} style={styles.noteCard}>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteContent} numberOfLines={2}>
                {note.content || 'Sem conteúdo'}
              </Text>
              <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma nota encontrada</Text>
        )}
      </View>

      {/* Today's Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos de Hoje</Text>
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>
                  {formatTime(event.startDate)}
                </Text>
              </View>
              {event.description && (
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
              <View style={styles.eventFooter}>
                <Text style={styles.eventType}>{event.type}</Text>
                {event.location && (
                  <Text style={styles.eventLocation}>{event.location}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum evento para hoje</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0', // Cor de papel envelhecido
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6F0',
  },
  header: {
    backgroundColor: '#2C3E50', // Azul escuro como capa de caderno
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 3,
    borderBottomColor: '#34495E',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ECF0F1',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498DB',
    paddingBottom: 5,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 15,
    color: '#495057',
    marginTop: 5,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 8,
    fontStyle: 'italic',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: 'bold',
    backgroundColor: '#FDF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventDescription: {
    fontSize: 15,
    color: '#495057',
    marginTop: 5,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  eventType: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#FDF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  eventLocation: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: 20,
    fontSize: 16,
  },
});
