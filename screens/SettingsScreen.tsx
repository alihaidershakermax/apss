import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

// Tab definitions
const TABS = [
  { id: 'general', icon: 'settings-outline', label: 'عام' },
  { id: 'appearance', icon: 'color-palette-outline', label: 'المظهر' },
  { id: 'security', icon: 'shield-checkmark-outline', label: 'الأمان' },
  { id: 'telegram', icon: 'paper-plane-outline', label: 'تليجرام' },
  { id: 'about', icon: 'information-circle-outline', label: 'حول' },
];

// Font options
const FONT_OPTIONS = [
  { id: 'cairo', name: 'Cairo', arabicName: 'القاهرة' },
  { id: 'tajawal', name: 'Tajawal', arabicName: 'تجوال' },
  { id: 'almarai', name: 'Almarai', arabicName: 'المراعي' },
  { id: 'dubai', name: 'Dubai', arabicName: 'دبي' },
  { id: 'scheherazade', name: 'Scheherazade', arabicName: 'شهرزاد' },
  { id: 'noto', name: 'Noto Kufi Arabic', arabicName: 'نوتو كوفي' },
  { id: 'amiri', name: 'Amiri', arabicName: 'أميري' },
];

// Font size options
const FONT_SIZE_OPTIONS = [
  { id: 'small', name: 'صغير', size: 14 },
  { id: 'medium', name: 'متوسط', size: 16 },
  { id: 'large', name: 'كبير', size: 18 },
  { id: 'xlarge', name: 'كبير جداً', size: 20 },
];

// Book design options
const BOOK_DESIGN_OPTIONS = [
  { id: 'classic', name: 'كلاسيكي', color: '#8B4513' },
  { id: 'modern', name: 'عصري', color: '#2196F3' },
  { id: 'leather', name: 'جلدي', color: '#5D4037' },
  { id: 'minimal', name: 'بسيط', color: '#9E9E9E' },
  { id: 'vintage', name: 'قديم', color: '#795548' },
  { id: 'elegant', name: 'أنيق', color: '#3F51B5' },
  { id: 'dark', name: 'داكن', color: '#212121' },
  { id: 'colorful', name: 'ملون', color: '#E91E63' },
];

// Backup frequency options
const BACKUP_FREQUENCY_OPTIONS = [
  { id: 'daily', name: 'يومي' },
  { id: 'weekly', name: 'أسبوعي' },
  { id: 'monthly', name: 'شهري' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  
  // Local state for all settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ar');
  const [notifications, setNotifications] = useState(true);
  const [fontFamily, setFontFamily] = useState('cairo');
  const [fontSize, setFontSize] = useState('medium');
  const [bookDesign, setBookDesign] = useState('classic');
  const [appLock, setAppLock] = useState(false);
  const [telegramBackup, setTelegramBackup] = useState(false);
  const [telegramBot, setTelegramBot] = useState('');
  const [telegramChannel, setTelegramChannel] = useState('');
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  
  // UI state
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [fontModal, setFontModal] = useState(false);
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [bookDesignModal, setBookDesignModal] = useState(false);
  
  // Animation for tab indicator
  const [tabIndicatorPosition] = useState(new Animated.Value(0));
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tabIndex = TABS.findIndex(tab => tab.id === tabId);
    Animated.spring(tabIndicatorPosition, {
      toValue: tabIndex * (width / TABS.length),
      useNativeDriver: false,
    }).start();
  };
  
  // Save settings
  const saveSettings = () => {
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast.success('تم حفظ الإعدادات بنجاح');
    }, 1000);
  };
  
  // Handle backup now
  const handleBackupNow = () => {
    if (!telegramBot || !telegramChannel) {
      Alert.alert(
        'خطأ',
        'يرجى إدخال اسم بوت تليجرام وقناة النسخ الاحتياطي',
        [{ text: 'حسناً' }]
      );
      return;
    }
    
    setLoading(true);
    
    // Simulate backup
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إرسال نسخة احتياطية إلى تليجرام');
    }, 2000);
  };
  
  // Handle app lock toggle
  const handleAppLockToggle = (value) => {
    if (value) {
      Alert.alert(
        'تفعيل قفل التطبيق',
        'هل أنت متأكد من تفعيل قفل التطبيق؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { 
            text: 'تفعيل', 
            onPress: () => {
              setAppLock(true);
              toast.success('تم تفعيل قفل التطبيق');
            }
          }
        ]
      );
    } else {
      setAppLock(false);
      toast.success('تم إلغاء تفعيل قفل التطبيق');
    }
  };
  
  // Handle change lock code
  const handleChangeLockCode = () => {
    Alert.alert(
      'تغيير رمز القفل',
      'هل أنت متأكد من تغيير رمز القفل؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تغيير', 
          onPress: () => {
            toast.success('تم تغيير رمز القفل');
          }
        }
      ]
    );
  };
  
  // Handle delete all data
  const handleDeleteAllData = () => {
    Alert.alert(
      'حذف جميع البيانات',
      'هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            
            // Simulate deleting data
            setTimeout(() => {
              setLoading(false);
              toast.success('تم حذف جميع البيانات');
              navigation.goBack();
            }, 2000);
          }
        }
      ]
    );
  };
  
  // Open Telegram bot
  const openTelegramBot = () => {
    if (!telegramBot) {
      Alert.alert(
        'خطأ',
        'يرجى إدخال اسم بوت تليجرام',
        [{ text: 'حسناً' }]
      );
      return;
    }
    
    // In a real app, we would open the Telegram bot
    Alert.alert(
      'فتح بوت تليجرام',
      `سيتم فتح بوت تليجرام: ${telegramBot}`,
      [{ text: 'حسناً' }]
    );
  };
  
  // Open Telegram channel
  const openTelegramChannel = () => {
    if (!telegramChannel) {
      Alert.alert(
        'خطأ',
        'يرجى إدخال اسم قناة تليجرام',
        [{ text: 'حسناً' }]
      );
      return;
    }
    
    // In a real app, we would open the Telegram channel
    Alert.alert(
      'فتح قناة تليجرام',
      `سيتم فتح قناة تليجرام: ${telegramChannel}`,
      [{ text: 'حسناً' }]
    );
  };
  
  // Render general settings
  const renderGeneralSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>الوضع الداكن</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#4CAF50' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>اللغة</Text>
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'ar' && styles.selectedLanguage,
              { backgroundColor: darkMode ? '#2a2a2a' : '#f0f0f0' }
            ]}
            onPress={() => setLanguage('ar')}
          >
            <Text style={[
              styles.languageText,
              language === 'ar' && styles.selectedLanguageText,
              { color: darkMode ? '#fff' : '#000' }
            ]}>عربي</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'en' && styles.selectedLanguage,
              { backgroundColor: darkMode ? '#2a2a2a' : '#f0f0f0' }
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[
              styles.languageText,
              language === 'en' && styles.selectedLanguageText,
              { color: darkMode ? '#fff' : '#000' }
            ]}>English</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>الإشعارات</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
        />
      </View>
      
      {notifications && (
        <View style={[styles.settingSubItem, { backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5' }]}>
          <Text style={[styles.settingSubLabel, { color: darkMode ? '#ccc' : '#666' }]}>
            وقت التذكير اليومي للكتابة
          </Text>
          <TouchableOpacity style={styles.timeSelector}>
            <Text style={[styles.timeText, { color: darkMode ? '#fff' : '#000' }]}>08:00 PM</Text>
            <Ionicons name="time-outline" size={20} color={darkMode ? '#ccc' : '#666'} />
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={saveSettings}
      >
        <Text style={styles.buttonText}>حفظ الإعدادات</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render appearance settings
  const renderAppearanceSettings = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={[styles.settingItem, styles.modalTrigger]}
        onPress={() => setFontModal(true)}
      >
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>نوع الخط</Text>
        <View style={styles.settingValueContainer}>
          <Text style={[styles.settingValue, { color: darkMode ? '#ccc' : '#666' }]}>
            {FONT_OPTIONS.find(font => font.id === fontFamily)?.arabicName || 'القاهرة'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#ccc' : '#666'} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.settingItem, styles.modalTrigger]}
        onPress={() => setFontSizeModal(true)}
      >
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>حجم الخط</Text>
        <View style={styles.settingValueContainer}>
          <Text style={[styles.settingValue, { color: darkMode ? '#ccc' : '#666' }]}>
            {FONT_SIZE_OPTIONS.find(size => size.id === fontSize)?.name || 'متوسط'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#ccc' : '#666'} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.settingItem, styles.modalTrigger]}
        onPress={() => setBookDesignModal(true)}
      >
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>تصميم الكتاب</Text>
        <View style={styles.settingValueContainer}>
          <View 
            style={[
              styles.colorPreview, 
              { backgroundColor: BOOK_DESIGN_OPTIONS.find(design => design.id === bookDesign)?.color || '#8B4513' }
            ]} 
          />
          <Text style={[styles.settingValue, { color: darkMode ? '#ccc' : '#666' }]}>
            {BOOK_DESIGN_OPTIONS.find(design => design.id === bookDesign)?.name || 'كلاسيكي'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#ccc' : '#666'} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={saveSettings}
      >
        <Text style={styles.buttonText}>حفظ الإعدادات</Text>
      </TouchableOpacity>
      
      {/* Font Modal */}
      <Modal
        visible={fontModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFontModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>اختر نوع الخط</Text>
              <TouchableOpacity onPress={() => setFontModal(false)}>
                <Ionicons name="close" size={24} color={darkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {FONT_OPTIONS.map(font => (
                <TouchableOpacity
                  key={font.id}
                  style={[
                    styles.modalOption,
                    fontFamily === font.id && styles.selectedModalOption,
                    { backgroundColor: darkMode ? '#333' : '#f5f5f5' }
                  ]}
                  onPress={() => {
                    setFontFamily(font.id);
                    setFontModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    { color: darkMode ? '#fff' : '#000' },
                    { fontFamily: font.name }
                  ]}>
                    {font.arabicName}
                  </Text>
                  {fontFamily === font.id && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Font Size Modal */}
      <Modal
        visible={fontSizeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFontSizeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>اختر حجم الخط</Text>
              <TouchableOpacity onPress={() => setFontSizeModal(false)}>
                <Ionicons name="close" size={24} color={darkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fontSizePreview}>
              <Text style={[
                styles.fontSizePreviewText,
                { color: darkMode ? '#fff' : '#000' },
                { fontSize: FONT_SIZE_OPTIONS.find(size => size.id === fontSize)?.size || 16 }
              ]}>
                نموذج للنص بهذا الحجم
              </Text>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {FONT_SIZE_OPTIONS.map(size => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.modalOption,
                    fontSize === size.id && styles.selectedModalOption,
                    { backgroundColor: darkMode ? '#333' : '#f5f5f5' }
                  ]}
                  onPress={() => {
                    setFontSize(size.id);
                    setFontSizeModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    { color: darkMode ? '#fff' : '#000' },
                    { fontSize: size.size }
                  ]}>
                    {size.name}
                  </Text>
                  {fontSize === size.id && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Book Design Modal */}
      <Modal
        visible={bookDesignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBookDesignModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>اختر تصميم الكتاب</Text>
              <TouchableOpacity onPress={() => setBookDesignModal(false)}>
                <Ionicons name="close" size={24} color={darkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.designGrid}>
                {BOOK_DESIGN_OPTIONS.map(design => (
                  <TouchableOpacity
                    key={design.id}
                    style={[
                      styles.designItem,
                      bookDesign === design.id && styles.selectedDesignItem,
                      { backgroundColor: design.color }
                    ]}
                    onPress={() => {
                      setBookDesign(design.id);
                      setBookDesignModal(false);
                    }}
                  >
                    <Text style={styles.designItemText}>{design.name}</Text>
                    {bookDesign === design.id && (
                      <View style={styles.designItemCheckmark}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
  
  // Render security settings
  const renderSecuritySettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>قفل التطبيق</Text>
        <Switch
          value={appLock}
          onValueChange={handleAppLockToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={appLock ? '#4CAF50' : '#f4f3f4'}
        />
      </View>
      
      {appLock && (
        <TouchableOpacity
          style={[styles.settingSubItem, { backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5' }]}
          onPress={handleChangeLockCode}
        >
          <Text style={[styles.settingSubLabel, { color: darkMode ? '#ccc' : '#666' }]}>
            تغيير رمز القفل
          </Text>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#ccc' : '#666'} />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F44336', marginTop: 20 }]}
        onPress={handleDeleteAllData}
      >
        <Text style={styles.buttonText}>حذف جميع البيانات</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render telegram settings
  const renderTelegramSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>تفعيل النسخ الاحتياطي عبر تليجرام</Text>
        <Switch
          value={telegramBackup}
          onValueChange={setTelegramBackup}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={telegramBackup ? '#4CAF50' : '#f4f3f4'}
        />
      </View>
      
      {telegramBackup && (
        <>
          <View style={[styles.settingSubItem, { backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5' }]}>
            <Text style={[styles.settingSubLabel, { color: darkMode ? '#ccc' : '#666' }]}>
              بوت تليجرام
            </Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#444' : '#ccc' }
                ]}
                value={telegramBot}
                onChangeText={setTelegramBot}
                placeholder="مثال: @moalif_bot"
                placeholderTextColor={darkMode ? '#888' : '#999'}
                dir="ltr"
              />
              <TouchableOpacity style={styles.inputButton} onPress={openTelegramBot}>
                <Ionicons name="open-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.settingSubItem, { backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5' }]}>
            <Text style={[styles.settingSubLabel, { color: darkMode ? '#ccc' : '#666' }]}>
              قناة النسخ الاحتياطي
            </Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#444' : '#ccc' }
                ]}
                value={telegramChannel}
                onChangeText={setTelegramChannel}
                placeholder="مثال: @moalif_backup"
                placeholderTextColor={darkMode ? '#888' : '#999'}
                dir="ltr"
              />
              <TouchableOpacity style={styles.inputButton} onPress={openTelegramChannel}>
                <Ionicons name="open-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>نسخ احتياطي تلقائي</Text>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoBackup ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          
          {autoBackup && (
            <View style={[styles.settingSubItem, { backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5' }]}>
              <Text style={[styles.settingSubLabel, { color: darkMode ? '#ccc' : '#666' }]}>
                تكرار النسخ الاحتياطي
              </Text>
              <View style={styles.frequencySelector}>
                {BACKUP_FREQUENCY_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.frequencyOption,
                      backupFrequency === option.id && styles.selectedFrequency,
                      { backgroundColor: darkMode ? '#333' : '#f0f0f0' }
                    ]}
                    onPress={() => setBackupFrequency(option.id)}
                  >
                    <Text style={[
                      styles.frequencyText,
                      backupFrequency === option.id && styles.selectedFrequencyText,
                      { color: darkMode ? '#fff' : '#000' }
                    ]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2196F3' }]}
            onPress={handleBackupNow}
          >
            <Text style={styles.buttonText}>إرسال نسخة احتياطية الآن</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
  // Render about settings
  const renderAboutSettings = () => (
    <View style={styles.tabContent}>
      <View style={[styles.aboutCard, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>م</Text>
          </View>
          <Text style={[styles.appName, { color: darkMode ? '#fff' : '#000' }]}>مؤلف | Mo'alif</Text>
        </View>
        <Text style={[styles.appVersion, { color: darkMode ? '#ccc' : '#666' }]}>الإصدار 1.0.0</Text>
        <Text style={[styles.appDescription, { color: darkMode ? '#ccc' : '#666' }]}>
          تطبيق لتأليف الكتب بأسلوب بصري عصري، يضعك في مقعد الكاتب... من الصفحة الأولى حتى الطباعة.
        </Text>
      </View>
      
      <View style={styles.socialLinks}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0088cc' }]}>
          <Ionicons name="paper-plane" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>تليجرام</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}>
          <Ionicons name="logo-twitter" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>تويتر</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#E1306C' }]}>
          <Ionicons name="logo-instagram" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>انستغرام</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.aboutItem}>
        <Ionicons name="star-outline" size={20} color={darkMode ? '#ccc' : '#666'} />
        <Text style={[styles.aboutItemText, { color: darkMode ? '#fff' : '#000' }]}>تقييم التطبيق</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.aboutItem}>
        <Ionicons name="share-outline" size={20} color={darkMode ? '#ccc' : '#666'} />
        <Text style={[styles.aboutItemText, { color: darkMode ? '#fff' : '#000' }]}>مشاركة التطبيق</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.aboutItem}>
        <Ionicons name="mail-outline" size={20} color={darkMode ? '#ccc' : '#666'} />
        <Text style={[styles.aboutItemText, { color: darkMode ? '#fff' : '#000' }]}>تواصل معنا</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.aboutItem}>
        <Ionicons name="document-text-outline" size={20} color={darkMode ? '#ccc' : '#666'} />
        <Text style={[styles.aboutItemText, { color: darkMode ? '#fff' : '#000' }]}>سياسة الخصوصية</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#000' }]}>الإعدادات</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabChange(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={activeTab === tab.id ? '#4CAF50' : (darkMode ? '#ccc' : '#666')}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.id ? '#4CAF50' : (darkMode ? '#ccc' : '#666') }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              left: tabIndicatorPosition,
              width: width / TABS.length,
              backgroundColor: '#4CAF50'
            }
          ]}
        />
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'appearance' && renderAppearanceSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'telegram' && renderTelegramSettings()}
        {activeTab === 'about' && renderAboutSettings()}
      </ScrollView>
      
      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingContainer, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={[styles.loadingText, { color: darkMode ? '#fff' : '#000' }]}>جاري التحميل...</Text>
          </View>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  settingSubLabel: {
    fontSize: 14,
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  selectedLanguage: {
    backgroundColor: '#4CAF50',
  },
  languageText: {
    fontSize: 14,
  },
  selectedLanguageText: {
    color: '#fff',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    marginRight: 5,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTrigger: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 5,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedModalOption: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  modalOptionText: {
    fontSize: 16,
  },
  fontSizePreview: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  fontSizePreviewText: {
    textAlign: 'center',
  },
  designGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  designItem: {
    width: '48%',
    height: 100,
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputButton: {
    padding: 10,
  },
  frequencySelector: {
    flexDirection: 'row',
  },
  frequencyOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 5,
  },
  selectedFrequency: {
    backgroundColor: '#4CAF50',
  },
  frequencyText: {
    fontSize: 12,
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  aboutCard: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  aboutItemText: {
    fontSize: 16,
    marginLeft: 15,
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});