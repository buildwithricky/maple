import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';

type NotificationType = {
  id: string;
  title: string;
  description: string;
  image: any;
};

const Notification = () => {
  const [markAllRead, setMarkAllRead] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationType[]>([]);

  const getNotificationImage = (title: string) => {
    switch (title) {
      case "Security Alert":
        return require("../../../assets/MappleApp/icon_13.png");
      case "Transaction Confirmation":
        return require("../../../assets/MappleApp/icon_12.png");
      case "Exchange Rate Alerts":
        return require("../../../assets/MappleApp/icon_12.png");
      case "Account Verification":
        return require("../../../assets/MappleApp/icon_14.png");
      default:
        return require("../../../assets/MappleApp/icon_14.png");
    }
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API_URl}/notification/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data.data.data)) {
            const notificationsWithImages = data.data.data.map((notification: { _id: string; title: string; description: string; }) => ({
              id: notification._id,
              title: notification.title,
              description: notification.description,
              image: getNotificationImage(notification.title),
            }));
            setNotificationList(notificationsWithImages);
            console.log('Fetched notifications:', notificationsWithImages);
          } else {
            console.error('Invalid notifications format:', data.data);
          }
        } else {
          console.error('Failed to fetch notifications:', data.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URl}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMarkAllRead(true);
        setNotificationList(notificationList.map(notification => ({
          ...notification,
          read: true,
        })));
      } else {
        const data = await response.json();
        console.error('Failed to mark all as read:', data.message);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerRow}>
          <Text style={styles.todayText}>TODAY</Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all as Read</Text>
          </TouchableOpacity>
        </View>

        {notificationList.map((notification) => (
          <View key={notification.id} style={styles.notificationRow}>
            <Image source={notification.image} style={styles.notificationImage} />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationMessage}>{notification.title}</Text>
              <Text style={styles.notificationDate}>{notification.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  underline: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  todayText: {
    fontSize: 16,
    color: '#000',
  },
  markAllReadText: {
    fontSize: 16,
    color: 'red',
  },
  notificationRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 30,
    borderWidth: 0.5,
    borderColor: "#EEEEEE"
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 5
  },
  notificationDate: {
    fontSize: 14,
    color: 'grey',
    lineHeight: 24
  },
});

export default Notification;
