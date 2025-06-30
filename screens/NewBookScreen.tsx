import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

// Book design options
const BOOK_DESIGNS = [
  { id: 'classic', name: 'كلاسيكي', color: '#8B4513' },
  { id: 'modern', name: 'عصري', color: '#2196F3' },
  { id: 'leather', name: 'جلدي', color: '#5D4037' },
  { id: 'minimal', name: 'بسيط', color: '#9E9E9E' },
  { id: 'vintage', name: 'قديم', color: '#795548' },
  { id: 'elegant', name: 'أنيق', color: '#3F51B5' },
  { id: 'dark', name: 'داكن', color: '#212121' },
  { id: 'colorful', name: 'ملون', color: '#E91E63' },
];

// Font options
const FONT_OPTIONS = [
  { id: 'cairo', name: 'Cairo', arabicName: 'القاهرة' },
  { id: 'tajawal', name: 'Tajawal', arabicName: 'تجوال' },
  { id: 'almarai', name: 'Almarai', arabicName: 'المراعي' },
  { id: 'dubai', name: 'Dubai', arabicName: 'دبي' },
  { id: 'scheherazade', name: 'Scheherazade', arabicName: 'شهرزاد' },
];

export default function NewBookScreen() {
  const navigation = useNavigation();
  
  // State
  const [bookTitle, setBookTitle] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('classic');
  const [selectedFont, setSelectedFont] = useState('cairo');
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  
  // Get book cover image based on design
  const getBookCover = (design) => {
    // In a real app, we would return different images based on design
    return `https://api.a0.dev/assets/image?text=${encodeURIComponent(bookTitle || 'كتاب جديد')}&aspect=1:1.5&seed=${design}`;
  };
  
  // Create book
  const createBook = () => {
    if (!bookTitle.trim()) {
      toast.error('يرجى إدخال عنوان الكتاب');
      return;
    }
    
    setLoading(true);
    
    // Simulate creating a book
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إنشاء الكتاب بنجاح');
      navigation.navigate('BookView', { 
        bookId: Date.now().toString(),
        bookTitle,
        bookDesign: selectedDesign,
        bookFont: selectedFont
      });
    }, 1500);
  };
  
  // Generate cover image
  const generateCoverImage = () => {
    if (!bookTitle.trim()) {
      toast.error('يرجى إدخال عنوان الكتاب لإنشاء غلاف');
      return;
    }
    
    setLoading(true);
    
    // Simulate generating a cover image
    setTimeout(() => {
      setLoading(false);
      setCoverImage(getBookCover(selectedDesign));
      toast.success('تم إنشاء غلاف الكتاب');
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>كتاب جديد</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>معلومات الكتاب</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>عنوان الكتاب</Text>
            <TextInput
              style={styles.input}
              value={bookTitle}
              onChangeText={setBookTitle}
              placeholder="أدخل عنوان الكتاب"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>تصميم الكتاب</Text>
          
          <View style={styles.designGrid}>
            {BOOK_DESIGNS.map(design => (
              <TouchableOpacity
                key={design.id}
                style={[
                  styles.designItem,
                  selectedDesign === design.id && styles.selectedDesignItem,
                  { backgroundColor: design.color }
                ]}
                onPress={() => setSelectedDesign(design.id)}
              >
                <Text style={styles.designItemText}>{design.name}</Text>
                {selectedDesign === design.id && (
                  <View style={styles.designItemCheckmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>نوع الخط</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontSelector}>
            {FONT_OPTIONS.map(font => (
              <TouchableOpacity
                key={font.id}
                style={[
                  styles.fontOption,
                  selectedFont === font.id && styles.selectedFontOption
                ]}
                onPress={() => setSelectedFont(font.id)}
              >
                <Text style={[
                  styles.fontOptionText,
                  selectedFont === font.id && styles.selectedFontOptionText,
                  { fontFamily: font.name }
                ]}>
                  {font.arabicName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>غلاف الكتاب</Text>
          
          <View style={styles.coverContainer}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.coverImage} />
            ) : (
              <View style={[styles.coverPlaceholder, { backgroundColor: BOOK_DESIGNS.find(d => d.id === selectedDesign)?.color }]}>
                <Text style={styles.coverPlaceholderText}>{bookTitle || 'كتاب جديد'}</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.generateCoverButton}
              onPress={generateCoverImage}
            >
              <Ionicons name="image-outline" size={20} color="#fff" />
              <Text style={styles.generateCoverButtonText}>إنشاء غلاف تلقائي</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={createBook}
        >
          <Text style={styles.createButtonText}>إنشاء الكتاب</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
  },
  designGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  designItem: {
    width: (width - 50) / 2,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDesignItem: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  designItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  designItemCheckmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  fontOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFontOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  fontOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFontOptionText: {
    color: '#fff',
  },
  coverContainer: {
    alignItems: 'center',
  },
  coverImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  coverPlaceholder: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  generateCoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  generateCoverButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});