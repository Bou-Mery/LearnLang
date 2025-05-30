import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const userId = 1; // Hardcoded for now; replace with authenticated user ID

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const historyResponse = await axios.get(
        `http://192.168.11.104:5000/pronunciationHistory/${userId}`
      );
      if (historyResponse.data.status === 'Success') {
        setHistory(historyResponse.data.rows);
      } else {
        Alert.alert('Error', 'Failed to load pronunciation history');
      }

      const statsResponse = await axios.get(
        `http://192.168.11.104:5000/pronunciationStats/${userId}`
      );
      if (statsResponse.data.status === 'Success') {
        setStats(statsResponse.data.stats);
      } else {
        Alert.alert('Error', 'Failed to load pronunciation stats');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(history.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + entriesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, styles.wordColumn]}>{item.text}</Text>
      <Text style={[styles.itemText, styles.languageColumn]}>{item.level}</Text>
      <Text
        style={[
          styles.itemText,
          styles.resultColumn,
          item.checker === 'Perfect' ? styles.perfectResult : styles.notBadResult,
        ]}
      >
        {item.checker}
      </Text>
      <Text style={[styles.itemText, styles.dateColumn]}>
        {formatDate(item.created_at)}
      </Text>
    </View>
  );

  // Pie chart data for Perfect/Not Bad percentages
  const pieChartData = stats
    ? [
        {
          name: 'Perfect',
          percentage: parseFloat(stats.results.perfect_percentage),
          color: '#4CAF50',
          legendFontColor: '#333',
          legendFontSize: 14,
        },
        {
          name: 'Not Bad',
          percentage: parseFloat(stats.results.not_bad_percentage),
          color: '#FFC107',
          legendFontColor: '#333',
          legendFontSize: 14,
        },
      ]
    : [];

  // Bar chart data for language attempts
  const barChartData = stats
    ? {
        labels: stats.languages.map((lang) => lang.language),
        datasets: [
          {
            data: stats.languages.map((lang) => lang.attempt_count),
            color: (opacity = 1, index) =>
              index % 2 === 0
                ? `rgba(79, 142, 247, ${opacity})`
                : `rgba(33, 150, 243, ${opacity})`,
          },
        ],
      }
    : { labels: [], datasets: [{ data: [] }] };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={28} color="#fff" />
        <Text style={styles.headerText}>Pronunciation History</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {/* Dashboard Section (Charts) */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.dashboardTitle}>Your Pronunciation Stats</Text>
          {stats ? (
            <>
              {/* Pie Chart for Perfect/Not Bad */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  Pronunciation Results ({stats.results.total_attempts} Attempts)
                </Text>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 40}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="percentage"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>

              {/* Bar Chart for Languages */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Most Practiced Languages</Text>
                <BarChart
                  data={barChartData}
                  width={screenWidth - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" attempts"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(79, 142, 247, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.4,
                    fillShadowGradient: '#4F8EF7',
                    fillShadowGradientOpacity: 1,
                    propsForBackgroundLines: {
                      strokeDasharray: '',
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  showValuesOnTopOfBars
                />
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>No stats available</Text>
          )}
        </View>

        {/* History Table */}
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No pronunciation history found</Text>
          </View>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerItem, styles.wordColumn]}>Word</Text>
              <Text style={[styles.headerItem, styles.languageColumn]}>Language</Text>
              <Text style={[styles.headerItem, styles.resultColumn]}>Result</Text>
              <Text style={[styles.headerItem, styles.dateColumn]}>Date</Text>
            </View>
            <FlatList
              data={paginatedHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              scrollEnabled={false} // Let ScrollView handle scrolling
            />
            {/* Pagination Controls */}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  dashboardContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 15,
  },
  headerItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  wordColumn: {
    flex: 2,
    paddingHorizontal: 5,
  },
  languageColumn: {
    flex: 1.5,
    paddingHorizontal: 5,
  },
  resultColumn: {
    flex: 1.5,
    paddingHorizontal: 5,
  },
  dateColumn: {
    flex: 2.5,
    paddingHorizontal: 5,
  },
  perfectResult: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  notBadResult: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  paginationButton: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    color: '#333',
  },
});

export default HistoryScreen;