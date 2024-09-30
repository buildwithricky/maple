import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env'; 

interface LimitData {
  singleLimit: number;
  daily: {
    dailyTotal: number;
    remainingDailyLimit: number;
    dailyLimit: number;
  };
  weekly: {
    weeklyTotal: number;
    remainingWeeklyLimit: number;
    weeklyLimit: number;
  };
  monthly: {
    monthlyTotal: number;
    remainingMonthlyLimit: number;
    monthlyLimit: number;
  };
}

const CADLimitsScreen = () => {
  const navigation = useNavigation();
  const [limitData, setLimitData] = useState<LimitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLimitData();
  }, []);

  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fetchLimitData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URl}/mobile-transaction/get-limits/cad`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setLimitData(result.data);
      } else {
        setError('Failed to fetch limit data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const renderLimitItem = (title: string, limit: number, spent: number, left: number) => (
    <View style={styles.limitItem}>
      <Text style={styles.limitTitle}>{title}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(spent / limit) * 100}%` }]} />
      </View>
      <View style={styles.limitDetails}>
        <Text style={styles.limitText}>$ {formatNumber(spent)} spent / $ {formatNumber(limit)}</Text>
        <Text style={styles.limitText}>$ {formatNumber(left)} left</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="red" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>🇨🇦 CAD Outgoing Transaction Limits</Text>
      <Text style={styles.subheader}>How much you can send with your CAD Maple account</Text>
      <ScrollView style={styles.content}>
        {limitData && (
          <>
            <View style={styles.limitItem}>
              <Text style={styles.limitTitle}>Outgoing Limit (Single transaction)</Text>
              <Text style={styles.singleLimitText}>$ {formatNumber(limitData.singleLimit)}</Text>
            </View>
            {renderLimitItem(
              `Daily Limit of $ ${formatNumber(limitData.daily.dailyLimit)}`,
              limitData.daily.dailyLimit,
              limitData.daily.dailyTotal,
              limitData.daily.remainingDailyLimit
            )}
            {renderLimitItem(
              `Weekly Limit of $ ${formatNumber(limitData.weekly.weeklyLimit)}`,
              limitData.weekly.weeklyLimit,
              limitData.weekly.weeklyTotal,
              limitData.weekly.remainingWeeklyLimit
            )}
            {renderLimitItem(
              `Monthly Limit of $ ${formatNumber(limitData.monthly.monthlyLimit)}`,
              limitData.monthly.monthlyLimit,
              limitData.monthly.monthlyTotal,
              limitData.monthly.remainingMonthlyLimit
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  limitItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  limitTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  singleLimitText: {
    fontSize: 18,
    fontWeight: "500",
    color: 'red',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginVertical: 8,
  },
  progress: {
    height: 4,
    backgroundColor: 'red',
    borderRadius: 2,
  },
  limitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitText: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
});

export default CADLimitsScreen;