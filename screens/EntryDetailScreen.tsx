import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Sample entries data
const entriesData = {
  '1': { 
    id: '1', 
    title: 'يوم جميل في الحديقة', 
    date: '2025-06-25', 
    mood: 'happy', 
    bookId: '1',
    content: 'كان يوماً رائعاً قضيته مع العائلة في الحديقة. استمتعنا بالطقس الجميل وتناولنا الغداء في الهواء الطلق. لعبنا الكثير من الألعاب وقضينا وقتاً ممتعاً معاً.',
    imageUrl: 'https://api.a0.dev/assets/image?text=يوم جميل في الحديقة&aspect=1:1'
  },
  '2': { 
    id: '2', 
    title: 'تأملات مسائية', 
    date: '2025-06-22', 
    mood: 'calm', 
    bookId: '1',
    content: 'جلست على الشرفة أتأمل النجوم وأفكر في الحياة. كان المساء هادئاً والسماء صافية. شعرت بالسلام والهدوء. أحب هذه اللحظات التي أقضيها مع نفسي في التأمل والتفكير.',
    imageUrl: 'https://api.a0.dev/assets/image?text=تأملات مسائية&aspect=1:1'
  },
  '3': { 
    id: '3', 
    title: 'لقاء مع صديق قديم', 
    date: '2025-06-20', 
    mood: 'nostalgic', 
    bookId: '1',
    content: 'التقيت اليوم بصديق لم أره منذ سنوات. تحدثنا عن الذكريات القديمة وضحكنا كثيراً. كم هو جميل أن نلتقي بأصدقاء الطفولة ونستعيد معهم الذكريات الجميلة.',
    imageUrl: 'https://api.a0.dev/assets/image?text=لقاء مع صديق قديم&aspect=1:1'
  },
  '4': { 
    id: '4', 
    title: 'ذكرى من الطفولة', 
    date: '2025-06-24', 
    mood: 'nostalgic', 
    bookId: '2',
    content: 'تذكرت اليوم عندما كنت صغيراً وكنت ألعب في حديقة المنزل. كانت أيام جميلة وبسيطة. كنت أقضي ساعات في اللعب مع أصدقائي دون أي هموم.',
    imageUrl: 'https://api.a0.dev/assets/image?text=ذكرى من الطفولة&aspect=1:1'
  },
  '5': { 
    id: '5', 
    title: 'رحلتي إلى الجبال', 
    date: '2025-06-23', 
    mood: 'excited', 
    bookId: '3',
    content: 'قمت برحلة استكشافية رائعة إلى الجبال. كان المنظر خلاباً والهواء منعشاً. تسلقت إلى القمة واستمتعت بالمنظر الرائع من الأعلى. كانت تجربة لا تنسى.',
    imageUrl: 'https://api.a0.dev/assets/image?text=رحلتي إلى الجبال&aspect=1:1'
  },
};

// Mood icons mapping
const moodIcons = {
  happy: { name: 'emoticon-happy-outline', color: '#f1c40f' },
  sad: { name: 'emoticon-sad-outline', color: '#3498db' },
  angry: { name: 'emoticon-angry-outline', color: '#e74c3c' },
  excited: { name: 'emoticon-excited-outline', color: '#2ecc71' },
  calm: { name: 'emoticon-neutral-outline', color: '#9b59b6' },
  nostalgic: { name: 'emoticon-outline', color: '#f39c12' },
};

// Mood options
const moodOptions = [
  { id: 'happy', name: 'سعيد', icon: 'emoticon-happy-outline', color: '#f1c40f' },
  { id: 'calm', name: 'هادئ', icon: 'emoticon-neutral-outline', color: '#9b59b6' },
  { id: 'sad', name: 'حزين', icon: 'emoticon-sad-outline', color: '#3498db' },
  { id: 'angry', name: 'غاضب', icon: 'emoticon-angry-outline', color: '#e74c3c' },
  { id: 'excited', name: 'متحمس', icon: 'emoticon-excited-outline', color: '#2ecc71' },
  { id: 'nostalgic', name: 'حنين', icon: 'emoticon-outline', color: '#f39c12' },
];

export default function EntryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { entryId } = route.params || { entryId: '1' };
  
  const entry = entriesData[entryId];
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [selectedMood, setSelectedMood] = useState(entry.mood);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  // Function to save changes
  const saveChanges = () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان للمذكرة');
      return;
    }

    if (!content.trim()) {
      toast.error('يرجى كتابة محتوى المذكرة');
      return;
    }

    // Here you would update the entry in your storage
    // For now, we'll just show a success message and exit edit mode
    toast.success('تم حفظ التغييرات بنجاح');
    setIsEditing(false);
  };

  // Function to delete entry
  const confirmDelete = () => {
    Alert.alert(
      'حذف المذكرة',
      'هل أنت متأكد من حذف هذه المذكرة؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          onPress: () => {
            // Here you would delete the entry from your storage
            // For now, we'll just show a success message and navigate back
            toast.success('تم حذف المذكرة بنجاح');
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'تعديل المذكرة' : 'تفاصيل المذكرة'}
        </Text>
        {isEditing ? (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveChanges}
          >
            <Text style={styles.saveButtonText}>حفظ</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={24} color="#3498db" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Date display */}
        <Text style={styles.dateText}>{formatDate(entry.date)}</Text>

        {/* Title */}
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="عنوان المذكرة..."
            placeholderTextColor="#999"
            textAlign="right"
          />
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{entry.title}</Text>
            <MaterialCommunityIcons 
              name={moodIcons[entry.mood]?.name || 'emoticon-outline'} 
              size={28} 
              color={moodIcons[entry.mood]?.color || '#999'} 
            />
          </View>
        )}

        {/* Mood selection (when editing) */}
        {isEditing && (
          <View style={styles.moodSection}>
            <Text style={styles.sectionLabel}>الحالة المزاجية:</Text>
            <View style={styles.moodOptions}>
              {moodOptions.map(mood => (
                <TouchableOpacity 
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.id && { backgroundColor: mood.color + '30' }
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                >
                  <MaterialCommunityIcons 
                    name={mood.icon} 
                    size={28} 
                    color={mood.color} 
                  />
                  <Text style={styles.moodText}>{mood.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Image */}
        {entry.imageUrl && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: entry.imageUrl }} 
              style={styles.image} 
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content */}
        {isEditing ? (
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="اكتب مذكرتك هنا..."
            placeholderTextColor="#999"
            multiline
            textAlign="right"
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.content}>{entry.content}</Text>
        )}

        {/* Delete button (when editing) */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>حذف المذكرة</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  editButton: {
    padding: 5,
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
    color: '#999',
    marginBottom: 15,
    textAlign: 'right',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  moodSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '30%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  moodText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'right',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: '#333',
    height: 200,
    marginBottom: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});