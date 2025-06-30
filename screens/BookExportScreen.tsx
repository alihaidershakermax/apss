import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Switch,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Sample book data
const bookData = {
  '1': {
    id: '1',
    title: 'رحلة الحياة',
    author: 'أنت',
    coverColor: '#3498db',
    coverImage: 'https://api.a0.dev/assets/image?text=رحلة الحياة&aspect=2:3',
    style: 'classic',
    chapters: [
      {
        id: 'ch1',
        title: 'الفصل الأول: البداية',
        pages: [
          { id: 'p1', title: 'البداية' },
          { id: 'p2', title: 'التحول' },
        ]
      },
      {
        id: 'ch2',
        title: 'الفصل الثاني: المواجهة',
        pages: [
          { id: 'p3', title: 'التحدي الأول' },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'ذكريات الطفولة',
    author: 'أنت',
    coverColor: '#e74c3c',
    coverImage: 'https://api.a0.dev/assets/image?text=ذكريات الطفولة&aspect=2:3',
    style: 'vintage',
    chapters: [
      {
        id: 'ch1',
        title: 'الفصل الأول: سنوات الطفولة المبكرة',
        pages: [
          { id: 'p1', title: 'ذكرى من الطفولة' },
        ]
      }
    ]
  },
  '3': {
    id: '3',
    title: 'أيام الحرب',
    author: 'أنت',
    coverColor: '#2ecc71',
    coverImage: 'https://api.a0.dev/assets/image?text=أيام الحرب&aspect=2:3',
    style: 'military',
    chapters: [
      {
        id: 'ch1',
        title: 'الفصل الأول: بداية الحصار',
        pages: [
          { id: 'p1', title: 'يوم الحصار' },
        ]
      }
    ]
  }
};

// Export formats
const exportFormats = [
  { id: 'pdf', name: 'PDF', icon: 'document-text' },
  { id: 'epub', name: 'EPUB', icon: 'book' },
  { id: 'docx', name: 'Word', icon: 'document' },
  { id: 'txt', name: 'نص عادي', icon: 'document-text-outline' },
];

// Export destinations
const exportDestinations = [
  { id: 'download', name: 'تنزيل', icon: 'download' },
  { id: 'email', name: 'إرسال بالبريد', icon: 'mail' },
  { id: 'telegram', name: 'تليجرام', icon: 'paper-plane' },
  { id: 'drive', name: 'Google Drive', icon: 'cloud-upload' },
];

export default function BookExportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params || { bookId: '1' };
  
  const book = bookData[bookId];
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedDestination, setSelectedDestination] = useState('download');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeCover, setIncludeCover] = useState(true);
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Function to count total pages in the book
  const countTotalPages = () => {
    let count = 0;
    book.chapters.forEach(chapter => {
      count += chapter.pages.length;
    });
    return count;
  };

  // Function to export the book
  const exportBook = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`تم تصدير الكتاب بنجاح بصيغة ${exportFormats.find(f => f.id === selectedFormat).name}`);
      
      if (selectedDestination === 'download') {
        toast.info('تم حفظ الملف في مجلد التنزيلات');
      } else if (selectedDestination === 'email') {
        toast.info('تم إرسال الكتاب إلى بريدك الإلكتروني');
      } else if (selectedDestination === 'telegram') {
        toast.info('تم إرسال الكتاب إلى تليجرام');
      } else if (selectedDestination === 'drive') {
        toast.info('تم حفظ الكتاب في Google Drive');
      }
      
      navigation.goBack();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تصدير الكتاب</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Book info */}
        <View style={styles.bookInfoContainer}>
          <View style={styles.bookCoverContainer}>
            {book.coverImage ? (
              <Image 
                source={{ uri: book.coverImage }} 
                style={styles.bookCover}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.bookCover, { backgroundColor: book.coverColor }]} />
            )}
          </View>
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>بقلم: {book.author}</Text>
            <Text style={styles.bookStats}>
              {book.chapters.length} فصل | {countTotalPages()} صفحة
            </Text>
          </View>
        </View>

        {/* Export format */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>صيغة التصدير</Text>
          <View style={styles.formatOptions}>
            {exportFormats.map(format => (
              <TouchableOpacity 
                key={format.id}
                style={[
                  styles.formatOption,
                  selectedFormat === format.id && styles.selectedFormatOption
                ]}
                onPress={() => setSelectedFormat(format.id)}
              >
                <Ionicons 
                  name={format.icon} 
                  size={24} 
                  color={selectedFormat === format.id ? '#fff' : '#333'} 
                />
                <Text style={[
                  styles.formatName,
                  selectedFormat === format.id && styles.selectedFormatName
                ]}>
                  {format.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وجهة التصدير</Text>
          <View style={styles.destinationOptions}>
            {exportDestinations.map(destination => (
              <TouchableOpacity 
                key={destination.id}
                style={[
                  styles.destinationOption,
                  selectedDestination === destination.id && styles.selectedDestinationOption
                ]}
                onPress={() => setSelectedDestination(destination.id)}
              >
                <Ionicons 
                  name={destination.icon} 
                  size={24} 
                  color={selectedDestination === destination.id ? '#3498db' : '#666'} 
                />
                <Text style={[
                  styles.destinationName,
                  selectedDestination === destination.id && styles.selectedDestinationName
                ]}>
                  {destination.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خيارات التصدير</Text>
          
          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>تضمين الصور</Text>
              <Text style={styles.optionDescription}>إضافة الصور المرفقة بالصفحات</Text>
            </View>
            <Switch
              value={includeImages}
              onValueChange={setIncludeImages}
              trackColor={{ false: '#ddd', true: '#bde0ff' }}
              thumbColor={includeImages ? '#3498db' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>تضمين الغلاف</Text>
              <Text style={styles.optionDescription}>إضافة صورة غلاف الكتاب</Text>
            </View>
            <Switch
              value={includeCover}
              onValueChange={setIncludeCover}
              trackColor={{ false: '#ddd', true: '#bde0ff' }}
              thumbColor={includeCover ? '#3498db' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>جدول المحتويات</Text>
              <Text style={styles.optionDescription}>إضافة فهرس للفصول والصفحات</Text>
            </View>
            <Switch
              value={includeTableOfContents}
              onValueChange={setIncludeTableOfContents}
              trackColor={{ false: '#ddd', true: '#bde0ff' }}
              thumbColor={includeTableOfContents ? '#3498db' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>أرقام الصفحات</Text>
              <Text style={styles.optionDescription}>إضافة ترقيم للصفحات</Text>
            </View>
            <Switch
              value={includePageNumbers}
              onValueChange={setIncludePageNumbers}
              trackColor={{ false: '#ddd', true: '#bde0ff' }}
              thumbColor={includePageNumbers ? '#3498db' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معاينة</Text>
          <View style={styles.previewContainer}>
            <Image 
              source={{ uri: `https://api.a0.dev/assets/image?text=معاينة ${book.title} بصيغة ${exportFormats.find(f => f.id === selectedFormat).name}&aspect=16:9` }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>

      {/* Export button */}
      <View style={styles.exportContainer}>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportBook}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="download" size={20} color="#fff" style={styles.exportIcon} />
              <Text style={styles.exportButtonText}>
                تصدير الكتاب بصيغة {exportFormats.find(f => f.id === selectedFormat).name}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  bookInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookCoverContainer: {
    width: 80,
    height: 120,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 15,
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  bookStats: {
    fontSize: 14,
    color: '#3498db',
    textAlign: 'right',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  formatOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatOption: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
  },
  selectedFormatOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  formatName: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  selectedFormatName: {
    color: '#fff',
  },
  destinationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectedDestinationOption: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  destinationName: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  selectedDestinationName: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  previewContainer: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  exportContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  exportButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 5,
  },
  exportIcon: {
    marginRight: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});