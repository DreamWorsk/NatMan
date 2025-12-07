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

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState('active');

  // Пример данных билетов
  const activeTickets = [
    {
      id: 1,
      type: 'Единый билет',
      date: '15 Декабря 2024',
      price: '1500 ₽',
      status: 'Активен',
      qrCode: 'QR_CODE_12345',
      description: 'Доступ ко всем зонам парка'
    },
    {
      id: 2,
      type: 'Семейный билет',
      date: '20 Декабря 2024',
      price: '4000 ₽',
      status: 'Активен',
      qrCode: 'QR_CODE_67890',
      description: 'Для 2 взрослых и 2 детей'
    },
  ];

  const pastTickets = [
    {
      id: 3,
      type: 'Детский билет',
      date: '10 Ноября 2024',
      price: '800 ₽',
      status: 'Использован',
      description: 'Для детей до 12 лет'
    },
    {
      id: 4,
      type: 'Взрослый билет',
      date: '5 Ноября 2024',
      price: '1200 ₽',
      status: 'Использован',
      description: 'Стандартный билет'
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
          onPress: () => showPurchaseSuccess('Взрослый билет', '1500 ₽'),
        },
        {
          text: 'Детский (800₽)',
          onPress: () => showPurchaseSuccess('Детский билет', '800 ₽'),
        },
        {
          text: 'Семейный (4000₽)',
          onPress: () => showPurchaseSuccess('Семейный билет', '4000 ₽'),
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const showPurchaseSuccess = (type, price) => {
    Alert.alert(
      'Успешно!',
      `Вы приобрели ${type} за ${price}`,
      [{ text: 'OK' }]
    );
  };

  const showQRCode = (ticket) => {
    Alert.alert(
      `QR-код: ${ticket.type}`,
      `Код: ${ticket.qrCode}\n\nПокажите этот код на входе в парк`,
      [
        { text: 'Закрыть', style: 'cancel' },
        { text: 'Сохранить', onPress: () => Alert.alert('Сохранено', 'QR-код сохранен в галерею') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои билеты</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Переключение вкладок */}
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

      {/* Список билетов */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Нет билетов</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'У вас нет активных билетов' 
                : 'У вас нет билетов в истории'
              }
            </Text>
          </View>
        ) : (
          tickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={styles.ticketType}>{ticket.type}</Text>
                  <Text style={styles.ticketDescription}>{ticket.description}</Text>
                </View>
                <Text style={styles.ticketPrice}>{ticket.price}</Text>
              </View>
              
              <View style={styles.ticketDateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.ticketDate}>{ticket.date}</Text>
              </View>

              <View style={styles.ticketFooter}>
                <View style={[
                  styles.statusBadge,
                  ticket.status === 'Активен' ? styles.statusActive : styles.statusUsed
                ]}>
                  <Text style={styles.statusText}>{ticket.status}</Text>
                </View>
                
                {ticket.status === 'Активен' && (
                  <TouchableOpacity 
                    style={styles.qrButton}
                    onPress={() => showQRCode(ticket)}
                  >
                    <Ionicons name="qr-code-outline" size={20} color="#007AFF" />
                    <Text style={styles.qrButtonText}>QR-код</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Кнопка покупки */}
      {activeTab === 'active' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.purchaseButton} onPress={purchaseTicket}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.purchaseButtonText}>Купить билет</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

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
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ticketDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#d4edda',
  },
  statusUsed: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#d4edda',
  },
  statusUsed: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#155724',
  },
  statusUsed: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#d4edda',
  },
  statusUsed: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  purchaseButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
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