import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { API_URl } from '@env';

// Initial notifications state
const notifications = [
  { id: 1, message: "Transaction Confirmation", date: "Your CAD to Naira exchange of $100 was successful. You've received N38,000 in your account.", image: require("../../../assets/MappleApp/icon_11.png") },
  { id: 2, message: "Exchange Rate Alerts", date: "CAD to Naira exchange rate has increased! Now's a great time to swap currencies.", image: require("../../../assets/MappleApp/icon_12.png") },
  { id: 3, message: "Security Alerts", date: "Unusual Activity detected on your account. Please verify your recent transactions.", image: require("../../../assets/MappleApp/icon_13.png") },
  { id: 4, message: "Account Verification", date: "Complete your account verification process to unlock higher exchange limits and additional features.", image: require("../../../assets/MappleApp/icon_14.png") },
];

const Notification = () => {
  const [markAllRead, setMarkAllRead] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URl}/api/notification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setNotificationList(data.notifications);
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
      const response = await fetch(`${API_URl}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
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
