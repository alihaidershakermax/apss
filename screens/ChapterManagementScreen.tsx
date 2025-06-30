import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  FlatList,
  Alert
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

export default function ChapterManagementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params || { bookId: '1' };
  
  const book = bookData[bookId];
  const [chapters, setChapters] = useState(book.chapters);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedChapterId, setDraggedChapterId] = useState(null);

  // Function to add a new chapter
  const addChapter = () => {
    if (!newChapterTitle.trim()) {
      toast.error('يرجى إدخال عنوان للفصل');
      return;
    }

    const newChapter = {
      id: `ch${chapters.length + 1}`,
      title: newChapterTitle,
      pages: []
    };

    setChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    toast.success('تم إضافة الفصل بنجاح');
  };

  // Function to start editing a chapter
  const startEditingChapter = (chapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  // Function to save edited chapter
  const saveEditedChapter = () => {
    if (!editingChapterTitle.trim()) {
      toast.error('يرجى إدخال عنوان للفصل');
      return;
    }

    const updatedChapters = chapters.map(chapter => 
      chapter.id === editingChapterId 
        ? { ...chapter, title: editingChapterTitle } 
        : chapter
    );

    setChapters(updatedChapters);
    setEditingChapterId(null);
    setEditingChapterTitle('');
    toast.success('تم تعديل الفصل بنجاح');
  };

  // Function to delete a chapter
  const deleteChapter = (chapterId) => {
    Alert.alert(
      'حذف الفصل',
      'هل أنت متأكد من حذف هذا الفصل؟ سيتم حذف جميع الصفحات المرتبطة به.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            const updatedChapters = chapters.filter(chapter => chapter.id !== chapterId);
            setChapters(updatedChapters);
            toast.success('تم حذف الفصل بنجاح');
          },
        },
      ]
    );
  };

  // Function to move chapter up
  const moveChapterUp = (index) => {
    if (index === 0) return;
    
    const updatedChapters = [...chapters];
    const temp = updatedChapters[index];
    updatedChapters[index] = updatedChapters[index - 1];
    updatedChapters[index - 1] = temp;
    
    setChapters(updatedChapters);
  };

  // Function to move chapter down
  const moveChapterDown = (index) => {
    if (index === chapters.length - 1) return;
    
    const updatedChapters = [...chapters];
    const temp = updatedChapters[index];
    updatedChapters[index] = updatedChapters[index + 1];
    updatedChapters[index + 1] = temp;
    
    setChapters(updatedChapters);
  };

  // Function to render chapter item
  const renderChapterItem = ({ item, index }) => (
    <View style={styles.chapterItem}>
      {editingChapterId === item.id ? (
        <View style={styles.editChapterContainer}>
          <TextInput
            style={styles.editChapterInput}
            value={editingChapterTitle}
            onChangeText={setEditingChapterTitle}
            placeholder="عنوان الفصل"
            placeholderTextColor="#999"
            textAlign="right"
          />
          <View style={styles.editChapterButtons}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveEditedChapter}
            >
              <Text style={styles.saveButtonText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setEditingChapterId(null)}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.chapterContent}>
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle}>{item.title}</Text>
            <Text style={styles.chapterPages}>{item.pages.length} صفحة</Text>
          </View>
          <View style={styles.chapterActions}>
            <TouchableOpacity 
              style={styles.chapterActionButton}
              onPress={() => startEditingChapter(item)}
            >
              <Ionicons name="pencil" size={18} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.chapterActionButton}
              onPress={() => deleteChapter(item.id)}
            >
              <Ionicons name="trash" size={18} color="#e74c3c" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chapterActionButton, index === 0 && styles.disabledButton]}
              onPress={() => moveChapterUp(index)}
              disabled={index === 0}
            >
              <Ionicons name="arrow-up" size={18} color={index === 0 ? "#ccc" : "#333"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chapterActionButton, index === chapters.length - 1 && styles.disabledButton]}
              onPress={() => moveChapterDown(index)}
              disabled={index === chapters.length - 1}
            >
              <Ionicons name="arrow-down" size={18} color={index === chapters.length - 1 ? "#ccc" : "#333"} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>إدارة الفصول</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookChapters}>{chapters.length} فصل</Text>
      </View>

      {/* Add new chapter */}
      <View style={styles.addChapterContainer}>
        <TextInput
          style={styles.chapterInput}
          value={newChapterTitle}
          onChangeText={setNewChapterTitle}
          placeholder="عنوان الفصل الجديد"
          placeholderTextColor="#999"
          textAlign="right"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addChapter}
        >
          <Text style={styles.addButtonText}>إضافة فصل</Text>
        </TouchableOpacity>
      </View>

      {/* Chapters list */}
      <FlatList
        data={chapters}
        renderItem={renderChapterItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chaptersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="book-open-page-variant" size={60} color="#ccc" />
            <Text style={styles.emptyText}>لا توجد فصول</Text>
            <Text style={styles.emptySubText}>أضف فصولاً جديدة لتنظيم كتابك</Text>
          </View>
        }
      />

      {/* Save button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity 
          style={styles.saveAllButton}
          onPress={() => {
          // Here you would save the chapters to your storage
          toast.success('تم حفظ التغييرات بنجاح');
          navigation.goBack();
        }}
        >
          <Text style={styles.saveAllButtonText}>حفظ التغييرات</Text>
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
  bookInfo: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookChapters: {
    fontSize: 14,
    color: '#666',
  },
  addChapterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chapterInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chaptersList: {
    padding: 15,
  },
  chapterItem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chapterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 5,
  },
  chapterPages: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  chapterActions: {
    flexDirection: 'row',
  },
  chapterActionButton: {
    padding: 5,
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  editChapterContainer: {
    padding: 15,
  },
  editChapterInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  editChapterButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  saveContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveAllButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});