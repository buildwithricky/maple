import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../../navigation';

type NotificationType = {
  id: string;
  title: string;
  description: string;
  image: any;
  timestamp: string;
  read: boolean;
};

const Notification = () => {
  const [markAllRead, setMarkAllRead] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'notification'>>();

  const getReadNotificationsKey = async () => {
    const token = await SecureStore.getItemAsync('token');
    return `readNotifications_${token}`;
  };

  const handleNotificationPress = async (notification: NotificationType) => {
    if (!notification.read) {
      // Mark the notification as read
      const updatedList = notificationList.map(item => 
        item.id === notification.id ? { ...item, read: true } : item
      );
      setNotificationList(updatedList);
      
      // Save the updated read status
      await saveReadStatus(notification.id);
    }

    navigation.navigate('NotificationDes', { notification: { ...notification, read: true } });
  };

  const saveReadStatus = async (notificationId: string) => {
    try {
      const key = await getReadNotificationsKey();
      const readNotifications = await SecureStore.getItemAsync(key) || '[]';
      const readList = JSON.parse(readNotifications);
      if (!readList.includes(notificationId)) {
        readList.push(notificationId);
        await SecureStore.setItemAsync(key, JSON.stringify(readList));
      }
    } catch (error) {
      console.error('Error saving read status:', error);
    }
  };

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

  const getTimeCategory = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays < 7) {
      return "This week";
    } else if (diffInDays < 30) {
      return "This month";
    } else {
      return "Forever";
    }
  };

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
          const readNotifications = await SecureStore.getItemAsync('readNotifications') || '[]';
          const readList = JSON.parse(readNotifications);

          const notificationsWithImages = data.data.data.map((notification: { _id: string; title: string; description: string; timestamp: string; }) => ({
            id: notification._id,
            title: notification.title,
            description: notification.description,
            image: getNotificationImage(notification.title),
            timestamp: notification.timestamp,
            read: readList.includes(notification._id),
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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };


  const groupedNotifications = notificationList.reduce<{ [key: string]: NotificationType[] }>((acc, notification) => {
    const category = notification.timestamp ? getTimeCategory(new Date(notification.timestamp)) : 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notification);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      {loading && <SpinnerOverlay />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.keys(groupedNotifications).map(category => (
          <View key={category}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
            </View>
            {groupedNotifications[category].map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationRow}
                onPress={() => handleNotificationPress(notification)}
              >
                <Image source={notification.image} style={styles.notificationImage} />
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationMessage}>{notification.title}</Text>
                  <Text style={styles.notificationDate}>
                    {notification.description.split(' ').slice(0, 20).join(' ') + 
                     (notification.description.split(' ').length > 20 ? '...' : '')}
                  </Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  categoryText: {
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
    marginHorizontal: 15,
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
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Notification;
