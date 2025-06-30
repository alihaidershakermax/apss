import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const { width, height } = Dimensions.get('window');

// Sample pages data
const SAMPLE_PAGES = [
  { 
    id: '1', 
    title: 'المقدمة', 
    content: 'هذه هي بداية رحلتي في كتابة هذا الكتاب. أتمنى أن تكون رحلة ممتعة ومفيدة للجميع.',
    date: '2023-06-01',
    image: null
  },
  { 
    id: '2', 
    title: 'الفصل الأول: البداية', 
    content: 'في هذا الفصل سنتحدث عن بداية القصة وكيف بدأت الأحداث تتشكل. كانت البداية صعبة ولكنها كانت ضرورية لفهم ما سيأتي لاحقاً.',
    date: '2023-06-05',
    image: 'https://api.a0.dev/assets/image?text=الفصل الأول&aspect=16:9&seed=chapter1'
  },
  { 
    id: '3', 
    title: 'الفصل الثاني: التحديات', 
    content: 'واجهت العديد من التحديات في هذه المرحلة، لكن كل تحدٍ كان درساً جديداً أتعلمه. الصعوبات تصنع منا أشخاصاً أقوى وأكثر حكمة.',
    date: '2023-06-10',
    image: null
  },
  { 
    id: '4', 
    title: 'الفصل الثالث: الحلول', 
    content: 'بعد كل مشكلة هناك حل، وبعد كل ليل هناك فجر. في هذا الفصل سنتحدث عن الحلول التي وجدتها للتحديات السابقة.',
    date: '2023-06-15',
    image: 'https://api.a0.dev/assets/image?text=الحلول&aspect=16:9&seed=solutions'
  },
  { 
    id: '5', 
    title: 'الخاتمة', 
    content: 'وهكذا نصل إلى نهاية رحلتنا في هذا الكتاب. أتمنى أن تكون قد استفدت من هذه التجربة كما استفدت أنا من كتابتها.',
    date: '2023-06-20',
    image: null
  },
];

export default function BookViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get book details from route params
  const { bookId, bookTitle, bookDesign, bookFont } = route.params || {};
  
  // State
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(SAMPLE_PAGES);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Animation values
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const pageScale = useRef(new Animated.Value(1)).current;
  
  // Pan responder for page flipping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pageScale.setValue(0.95);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isFlipping) return;
        
        const { dx } = gestureState;
        const newValue = dx / width;
        
        // Limit the animation value between -0.2 and 0.2
        if (newValue > -0.2 && newValue < 0.2) {
          flipAnimation.setValue(newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        
        // Reset scale
        Animated.spring(pageScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
        
        if (isFlipping) return;
        
        // If swipe distance is significant, flip the page
        if (dx < -50 && currentPage < pages.length - 1) {
          // Flip to next page
          setIsFlipping(true);
          Animated.timing(flipAnimation, {
            toValue: -1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentPage(currentPage + 1);
            flipAnimation.setValue(0);
            setIsFlipping(false);
          });
        } else if (dx > 50 && currentPage > 0) {
          // Flip to previous page
          setIsFlipping(true);
          Animated.timing(flipAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentPage(currentPage - 1);
            flipAnimation.setValue(0);
            setIsFlipping(false);
          });
        } else {
          // Return to current page
          Animated.spring(flipAnimation, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  
  // Calculate flip rotation
  const flipRotation = flipAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['30deg', '0deg', '-30deg'],
  });
  
  // Calculate page opacity
  const pageOpacity = flipAnimation.interpolate({
    inputRange: [-0.2, 0, 0.2],
    outputRange: [0.8, 1, 0.8],
  });
  
  // Go to next page
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setIsFlipping(true);
      Animated.timing(flipAnimation, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPage(currentPage + 1);
        flipAnimation.setValue(0);
        setIsFlipping(false);
      });
    }
  };
  
  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPage(currentPage - 1);
        flipAnimation.setValue(0);
        setIsFlipping(false);
      });
    }
  };
  
  // Add new page
  const addNewPage = () => {
    navigation.navigate('NewPage', { bookId });
  };
  
  // Export book
  const exportBook = () => {
    navigation.navigate('BookExport', { bookId, bookTitle });
  };
  
  // Manage chapters
  const manageChapters = () => {
    navigation.navigate('ChapterManagement', { bookId });
  };
  
  // Toggle menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  // Get current page
  const currentPageData = pages[currentPage];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{bookTitle || 'كتابي'}</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Page counter */}
      <View style={styles.pageCounter}>
        <Text style={styles.pageCounterText}>
          {currentPage + 1} / {pages.length}
        </Text>
      </View>
      
      {/* Book page */}
      <View style={styles.bookContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.page,
            {
              transform: [
                { perspective: 1000 },
                { rotateY: flipRotation },
                { scale: pageScale },
              ],
              opacity: pageOpacity,
            },
          ]}
        >
          <ScrollView style={styles.pageContent}>
            <Text style={styles.pageTitle}>{currentPageData?.title}</Text>
            <Text style={styles.pageDate}>{currentPageData?.date}</Text>
            
            {currentPageData?.image && (
              <Image
                source={{ uri: currentPageData.image }}
                style={styles.pageImage}
                resizeMode="cover"
              />
            )}
            
            <Text style={styles.pageText}>{currentPageData?.content}</Text>
          </ScrollView>
        </Animated.View>
      </View>
      
      {/* Navigation buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]}
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage === 0 ? '#ccc' : '#000'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton} onPress={addNewPage}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentPage === pages.length - 1 && styles.disabledButton]}
          onPress={goToNextPage}
          disabled={currentPage === pages.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage === pages.length - 1 ? '#ccc' : '#000'}
          />
        </TouchableOpacity>
      </View>
      
      {/* Menu overlay */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={manageChapters}>
              <Ionicons name="list" size={24} color="#000" />
              <Text style={styles.menuItemText}>إدارة الفصول</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={exportBook}>
              <Ionicons name="download-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>تصدير الكتاب</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="share-social-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>مشاركة الكتاب</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>إعدادات الكتاب</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
              <Text style={styles.menuCloseButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  pageCounter: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageCounterText: {
    fontSize: 14,
    color: '#666',
  },
  bookContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  page: {
    width: width - 40,
    height: height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  pageContent: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'right',
  },
  pageDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'right',
  },
  pageImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  pageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'right',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#000',
  },
  menuCloseButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  menuCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});