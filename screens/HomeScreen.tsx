import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../App';

const { width } = Dimensions.get('window');

// Sample data for books
const SAMPLE_BOOKS = [
  { id: '1', title: 'رحلتي إلى الشرق', pages: 24, lastEdit: '2023-06-15', cover: 'classic' },
  { id: '2', title: 'مذكرات مسافر', pages: 56, lastEdit: '2023-06-10', cover: 'leather' },
  { id: '3', title: 'أيام الدراسة', pages: 32, lastEdit: '2023-06-05', cover: 'modern' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const settings = appContext?.settings || { darkMode: false, language: 'ar' };
  const isDarkMode = settings.darkMode;
  
  const [activeTab, setActiveTab] = useState('books');
  
  // Function to get book cover image based on style
  const getBookCover = (style) => {
    // In a real app, we would return different images based on style
    return 'https://api.a0.dev/assets/image?text=كتاب&aspect=1:1.5&seed=' + style;
  };
  
  // Render book item
  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.bookItem, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}
      onPress={() => navigation.navigate('BookView', { bookId: item.id })}
    >
      <Image 
        source={{ uri: getBookCover(item.cover) }} 
        style={styles.bookCover}
      />
      <Text style={[styles.bookTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
      <Text style={[styles.bookDetails, { color: isDarkMode ? '#ccc' : '#666' }]}>
        {item.pages} صفحة • آخر تعديل: {item.lastEdit}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: isDarkMode ? '#fff' : '#000' }]}>مؤلف | Mo'alif</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'books' && styles.activeTab]} 
          onPress={() => setActiveTab('books')}
        >
          <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>كتبي</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]} 
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>الإحصائيات</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content based on active tab */}
      {activeTab === 'books' ? (
        <>
          <FlatList
            data={SAMPLE_BOOKS}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.booksList}
            numColumns={2}
          />
          
          {/* Floating Action Button */}
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate('NewBook')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <Text style={[styles.statTitle, { color: isDarkMode ? '#fff' : '#000' }]}>إحصائيات الكتابة</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: isDarkMode ? '#fff' : '#000' }]}>3</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>كتب</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: isDarkMode ? '#fff' : '#000' }]}>112</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>صفحة</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: isDarkMode ? '#fff' : '#000' }]}>15</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>يوم كتابة</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <Text style={[styles.statTitle, { color: isDarkMode ? '#fff' : '#000' }]}>أكثر الأيام كتابة</Text>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 100, backgroundColor: '#4CAF50' }]} />
              <View style={[styles.bar, { height: 60, backgroundColor: '#2196F3' }]} />
              <View style={[styles.bar, { height: 80, backgroundColor: '#FFC107' }]} />
              <View style={[styles.bar, { height: 40, backgroundColor: '#9C27B0' }]} />
              <View style={[styles.bar, { height: 70, backgroundColor: '#F44336' }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={[styles.barLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>الأحد</Text>
              <Text style={[styles.barLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>الإثنين</Text>
              <Text style={[styles.barLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>الثلاثاء</Text>
              <Text style={[styles.barLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>الأربعاء</Text>
              <Text style={[styles.barLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>الخميس</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  booksList: {
    padding: 10,
  },
  bookItem: {
    width: (width - 40) / 2,
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  bookDetails: {
    fontSize: 12,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  statsContainer: {
    padding: 15,
  },
  statCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  barChart: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bar: {
    width: 30,
    borderRadius: 5,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  barLabel: {
    fontSize: 12,
  },
});