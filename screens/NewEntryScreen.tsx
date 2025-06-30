import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Sample books for dropdown
const books = [
  { id: '1', title: 'رحلة الحياة', chapters: [
    { id: 'ch1', title: 'الفصل الأول: البداية' },
    { id: 'ch2', title: 'الفصل الثاني: المواجهة' },
  ]},
  { id: '2', title: 'ذكريات الطفولة', chapters: [
    { id: 'ch1', title: 'الفصل الأول: سنوات الطفولة المبكرة' },
  ]},
  { id: '3', title: 'أيام الحرب', chapters: [
    { id: 'ch1', title: 'الفصل الأول: بداية الحصار' },
  ]},
];

export default function NewEntryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId: routeBookId } = route.params || { bookId: '1' };
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedBook, setSelectedBook] = useState(books.find(book => book.id === routeBookId) || books[0]);
  const [selectedChapter, setSelectedChapter] = useState(selectedBook.chapters[0]);
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [alignment, setAlignment] = useState('right');
  const [showFormatting, setShowFormatting] = useState(false);

  // Get current date in Arabic format
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('ar-EG', options);
  };

  // Function to generate image based on entry content
  const generateImage = async () => {
    if (!content || content.length < 10) {
      toast.error('يرجى كتابة محتوى كافٍ للصفحة أولاً');
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      // Generate a prompt based on the content
      const prompt = `${title || 'صفحة من كتاب'}: ${content.substring(0, 100)}`;
      
      // Call the image generation API
      const imageUrl = `https://api.a0.dev/assets/image?text=${encodeURIComponent(prompt)}&aspect=16:9`;
      setImageUrl(imageUrl);
      toast.success('تم إنشاء الصورة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الصورة');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Function to save the entry
  const savePage = () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان للصفحة');
      return;
    }

    if (!content.trim()) {
      toast.error('يرجى كتابة محتوى الصفحة');
      return;
    }

    // Here you would save the entry to your storage
    // For now, we'll just show a success message and navigate back
    toast.success('تم حفظ الصفحة بنجاح');
    navigation.goBack();
  };

  // Font size options
  const fontSizeOptions = [
    { id: 'small', name: 'صغير', size: 14 },
    { id: 'medium', name: 'متوسط', size: 16 },
    { id: 'large', name: 'كبير', size: 18 },
    { id: 'xlarge', name: 'كبير جداً', size: 20 },
  ];

  // Alignment options
  const alignmentOptions = [
    { id: 'right', name: 'يمين', icon: 'format-align-right' },
    { id: 'center', name: 'وسط', icon: 'format-align-center' },
    { id: 'left', name: 'يسار', icon: 'format-align-left' },
    { id: 'justify', name: 'ضبط', icon: 'format-align-justify' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>صفحة جديدة</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={savePage}
          >
            <Text style={styles.saveButtonText}>حفظ</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Date display */}
          <Text style={styles.dateText}>{getCurrentDate()}</Text>

          {/* Book selection */}
          <View style={styles.bookSelector}>
            <Text style={styles.sectionLabel}>الكتاب:</Text>
            <TouchableOpacity 
              style={styles.bookDropdown}
              onPress={() => {
                setShowBookDropdown(!showBookDropdown);
                setShowChapterDropdown(false);
              }}
            >
              <Text style={styles.bookDropdownText}>{selectedBook.title}</Text>
              <Ionicons 
                name={showBookDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {showBookDropdown && (
              <View style={styles.dropdownMenu}>
                {books.map(book => (
                  <TouchableOpacity 
                    key={book.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedBook(book);
                      setSelectedChapter(book.chapters[0]);
                      setShowBookDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{book.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Chapter selection */}
          <View style={styles.bookSelector}>
            <Text style={styles.sectionLabel}>الفصل:</Text>
            <TouchableOpacity 
              style={styles.bookDropdown}
              onPress={() => {
                setShowChapterDropdown(!showChapterDropdown);
                setShowBookDropdown(false);
              }}
            >
              <Text style={styles.bookDropdownText}>{selectedChapter.title}</Text>
              <Ionicons 
                name={showChapterDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {showChapterDropdown && (
              <View style={styles.dropdownMenu}>
                {selectedBook.chapters.map(chapter => (
                  <TouchableOpacity 
                    key={chapter.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedChapter(chapter);
                      setShowChapterDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{chapter.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Title input */}
          <TextInput
            style={styles.titleInput}
            placeholder="عنوان الصفحة..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            textAlign="right"
          />

          {/* Formatting options */}
          <View style={styles.formattingContainer}>
            <TouchableOpacity 
              style={styles.formattingButton}
              onPress={() => setShowFormatting(!showFormatting)}
            >
              <MaterialCommunityIcons name="format-text" size={20} color="#3498db" />
              <Text style={styles.formattingButtonText}>تنسيق النص</Text>
              <Ionicons 
                name={showFormatting ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#3498db" 
              />
            </TouchableOpacity>

            {showFormatting && (
              <View style={styles.formattingOptions}>
                <View style={styles.formattingSection}>
                  <Text style={styles.formattingLabel}>حجم الخط:</Text>
                  <View style={styles.fontSizeOptions}>
                    {fontSizeOptions.map(option => (
                      <TouchableOpacity 
                        key={option.id}
                        style={[
                          styles.fontSizeOption,
                          fontSize === option.id && styles.selectedFontSizeOption
                        ]}
                        onPress={() => setFontSize(option.id)}
                      >
                        <Text style={[
                          styles.fontSizeText,
                          { fontSize: option.size },
                          fontSize === option.id && styles.selectedOptionText
                        ]}>
                          أ
                        </Text>
                        <Text style={[
                          styles.fontSizeName,
                          fontSize === option.id && styles.selectedOptionText
                        ]}>
                          {option.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formattingSection}>
                  <Text style={styles.formattingLabel}>محاذاة:</Text>
                  <View style={styles.alignmentOptions}>
                    {alignmentOptions.map(option => (
                      <TouchableOpacity 
                        key={option.id}
                        style={[
                          styles.alignmentOption,
                          alignment === option.id && styles.selectedAlignmentOption
                        ]}
                        onPress={() => setAlignment(option.id)}
                      >
                        <MaterialCommunityIcons 
                          name={option.icon} 
                          size={20} 
                          color={alignment === option.id ? '#fff' : '#333'} 
                        />
                        <Text style={[
                          styles.alignmentName,
                          alignment === option.id && { color: '#fff' }
                        ]}>
                          {option.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Content input */}
          <TextInput
            style={[
              styles.contentInput,
              { 
                fontSize: fontSizeOptions.find(option => option.id === fontSize).size,
                textAlign: alignment === 'left' ? 'left' : alignment === 'center' ? 'center' : alignment === 'justify' ? 'justify' : 'right'
              }
            ]}
            placeholder="اكتب محتوى الصفحة هنا..."
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />

          {/* Image section */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionLabel}>الصورة:</Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity 
                style={styles.imageOption}
                onPress={() => toast.info('ميزة التقاط صورة قيد التطوير')}
              >
                <Ionicons name="camera-outline" size={24} color="#3498db" />
                <Text style={styles.imageOptionText}>التقاط صورة</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageOption}
                onPress={() => toast.info('ميزة اختيار صورة قيد التطوير')}
              >
                <Ionicons name="image-outline" size={24} color="#3498db" />
                <Text style={styles.imageOptionText}>اختيار صورة</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageOption}
                onPress={generateImage}
                disabled={isGeneratingImage}
              >
                <Ionicons name="sparkles-outline" size={24} color="#3498db" />
                <Text style={styles.imageOptionText}>
                  {isGeneratingImage ? 'جاري الإنشاء...' : 'إنشاء صورة'}
                </Text>
              </TouchableOpacity>
            </View>

            {imageUrl && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.imagePreview} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImageUrl(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Page position */}
          <View style={styles.pagePositionSection}>
            <Text style={styles.sectionLabel}>موضع الصفحة:</Text>
            <View style={styles.pagePositionOptions}>
              <TouchableOpacity style={[styles.pagePositionOption, styles.selectedPagePositionOption]}>
                <MaterialCommunityIcons name="page-last" size={24} color="#3498db" />
                <Text style={styles.pagePositionText}>إضافة في نهاية الفصل</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pagePositionOption}>
                <MaterialCommunityIcons name="page-first" size={24} color="#666" />
                <Text style={styles.pagePositionText}>إضافة في بداية الفصل</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'right',
  },
  bookSelector: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  bookDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
  },
  bookDropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  formattingContainer: {
    marginBottom: 15,
  },
  formattingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#bde0ff',
    borderRadius: 5,
    padding: 10,
  },
  formattingButtonText: {
    color: '#3498db',
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },
  formattingOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  formattingSection: {
    marginBottom: 15,
  },
  formattingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  fontSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontSizeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedFontSizeOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  fontSizeText: {
    color: '#333',
    marginBottom: 5,
  },
  fontSizeName: {
    fontSize: 12,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
  },
  alignmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedAlignmentOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  alignmentName: {
    fontSize: 12,
    color: '#333',
    marginLeft: 5,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    color: '#333',
    height: 200,
    marginBottom: 15,
    lineHeight: 24,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageOption: {
    width: '30%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  imageOptionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  pagePositionSection: {
    marginBottom: 20,
  },
  pagePositionOptions: {
    flexDirection: 'column',
  },
  pagePositionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  selectedPagePositionOption: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  pagePositionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});