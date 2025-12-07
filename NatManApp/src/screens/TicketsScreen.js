import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TicketsScreen = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeTickets = [
    {
      id: 1,
      type: 'Единый билет',
      date: '15 Декабря 2024',
      price: '1500 ₽',
      status: 'Активен',
      qrCode: 'QR_CODE_12345',
    },
    {
      id: 2,
      type: 'Семейный билет',
      date: '20 Декабря 2024',
      price: '4000 ₽',
      status: 'Активен',
      qrCode: 'QR_CODE_67890',
    },
  ];

  const pastTickets = [
    {
      id: 3,
      type: 'Детский билет',
      date: '10 Ноября 2024',
      price: '800 ₽',
      status: 'Использован',
    },
  ];

  const tickets = activeTab === 'active' ? activeTickets : pastTickets;

  const purchaseTicket = () => {
    Alert.alert(
      'Покупка билета',
      'Выберите тип билета:',
      [
        {
          text: 'Взрослый (1500₽)',
          onPress: () => Alert.alert('Успех', 'Билет приобретен!'),
        },
        {
          text: 'Детский (800₽)',
          onPress: () => Alert.alert('Успех', 'Билет приобретен!'),
        },
        {
          text: 'Семейный (4000₽)',
          onPress: () => Alert.alert('Успех', 'Билет приобретен!'),
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои билеты</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Активные
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            История
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Нет билетов</Text>
          </View>
        ) : (
          tickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketType}>{ticket.type}</Text>
                <Text style={styles.ticketPrice}>{ticket.price}</Text>
              </View>
              <Text style={styles.ticketDate}>{ticket.date}</Text>
              <View style={styles.ticketFooter}>
                <Text style={[styles.ticketStatus, 
                  ticket.status === 'Активен' ? styles.statusActive : styles.statusUsed
                ]}>
                  {ticket.status}
                </Text>
                {ticket.status === 'Активен' && (
                  <TouchableOpacity 
                    style={styles.qrButton}
                    onPress={() => Alert.alert('QR код', `Код: ${ticket.qrCode}`)}
                  >
                    <Text style={styles.qrButtonText}>Показать QR</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseTicket}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.purchaseButtonText}>Купить билет</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ticketDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusUsed: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  qrButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  purchaseButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TicketsScreen;