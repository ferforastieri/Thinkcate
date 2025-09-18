import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calendarService, Event } from '../services/calendarService';

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await calendarService.getToday();
      setEvents(response || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos');
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'task': return '#007AFF';
      case 'reminder': return '#FF9500';
      case 'birthday': return '#FF3B30';
      case 'event': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return 'checkmark-circle';
      case 'reminder': return 'alarm';
      case 'birthday': return 'gift';
      case 'event': return 'calendar';
      default: return 'circle';
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.eventTypeContainer}>
          <Ionicons 
            name={getEventTypeIcon(item.type)} 
            size={20} 
            color={getEventTypeColor(item.type)} 
          />
          <Text style={[styles.eventType, { color: getEventTypeColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.eventTime}>{formatTime(item.startDate)}</Text>
      </View>
      
      <Text style={styles.eventTitle}>{item.title}</Text>
      
      {item.description && (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.eventFooter}>
        <Text style={styles.eventDate}>{formatDate(item.startDate)}</Text>
        {item.location && (
          <Text style={styles.eventLocation}>
            <Ionicons name="location" size={12} color="#999" /> {item.location}
          </Text>
        )}
      </View>
      
      {item.isAllDay && (
        <View style={styles.allDayBadge}>
          <Text style={styles.allDayText}>DIA TODO</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum evento para hoje</Text>
            <Text style={styles.emptySubtext}>Toque no + para criar seu primeiro evento</Text>
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
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
  },
  eventLocation: {
    fontSize: 12,
    color: '#999',
  },
  allDayBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  allDayText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
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
