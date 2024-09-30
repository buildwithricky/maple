import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation';
import * as SecureStore from 'expo-secure-store';
import img from './Notification.png'

type NotificationDesRouteProp = RouteProp<RootStackParamList, 'NotificationDes'>;

type Props = {
  route: NotificationDesRouteProp;
};

const NotificationDes: React.FC<Props> = ({ route }) => {
  const { notification } = route.params;

  useEffect(() => {
    const markAsRead = async () => {
      try {
        const readNotifications = await SecureStore.getItemAsync('readNotifications') || '[]';
        const readList = JSON.parse(readNotifications);
        if (!readList.includes(notification.id)) {
          readList.push(notification.id);
          await SecureStore.setItemAsync('readNotifications', JSON.stringify(readList));
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    };

    markAsRead();
  }, [notification.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={img} style={styles.image} />
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.description}>{notification.description}</Text>
        <Text style={styles.timestamp}>{new Date(notification.timestamp).toLocaleString()}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20,
      },
      content: {
        paddingHorizontal: 20,
        alignItems: 'center',
      },
      image: {
        width: 260,
        height: 260,
        marginBottom: 20,
      },
      title: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
      },
      description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
        lineHeight: 30
      },
      timestamp: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
      },
      actionButton: {
        backgroundColor: '#7B61FF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignSelf: 'center',
        marginBottom: 20,
      },
      actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
});

export default NotificationDes;