import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Gap } from '../../components/atoms';
import { TextInput } from '../../components/molecules';
import {getDatabase, ref, push, set} from 'firebase/database';
import {showMessage} from 'react-native-flash-message';
import { Picker } from '@react-native-picker/picker';

interface SubjectProps {
  route: {
    params?: {
      uid?: string;
    };
  };
  navigation: any;
}

const Subject = ({ route, navigation }: SubjectProps) => {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');
  const [gradePoints, setGradePoints] = useState('');
  const [loading, setLoading] = useState(false);
  
  const uid = route?.params?.uid;

  const colors = ['#FFD600', '#00C9A7', '#2196F3', '#FF5252', '#A259FF', '#6A6AFF', '#4CAF50', '#FF9800'];

  const saveSubject = async (status: 'completed' | 'in_progress') => {
    if (!uid) {
      showMessage({
        message: 'User ID not found',
        type: 'danger',
      });
      return;
    }

    if (!subject || !teacher || !credits || !grade || !gradePoints) {
      showMessage({
        message: 'All fields are required',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    const db = getDatabase();
    const subjectsRef = ref(db, `users/${uid}/subjects`);
    
    try {
      const newSubjectRef = push(subjectsRef);
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      await set(newSubjectRef, {
        subject: subject,
        teacher: teacher,
        credits: parseInt(credits),
        grade: grade,
        gradePoints: parseFloat(gradePoints),
        status: status,
        color: randomColor,
        createdAt: Date.now()
      });
      
      showMessage({
        message: `Subject successfully saved as ${status === 'completed' ? 'completed' : 'in progress'}`,
        type: 'success',
      });
      
      // Reset form
      setSubject('');
      setTeacher('');
      setCredits('');
      setGrade('');
      setGradePoints('');
      
      console.log('Subject saved successfully');
    } catch (error) {
      console.error('Error saving subject:', error);
      showMessage({
        message: 'Failed to save subject',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlreadyDone = () => {
    saveSubject('completed');
  };

  const handleInProgress = () => {
    saveSubject('in_progress');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button 
          text=""
          iconOnly={true} 
          icon="back" 
          onPress={() => navigation.goBack()} 
        />
        <Text style={styles.headerTitle}>SUBJECT</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Input your subject this semester</Text>
        <Gap height={32} />
        <View style={styles.form}>
          <TextInput 
            placeholder="Subject" 
            value={subject}
            onChangeText={setSubject}
          />
          <Gap height={16} />
          <TextInput 
            placeholder="Teacher Name" 
            value={teacher}
            onChangeText={setTeacher}
          />
          <Gap height={16} />
          <View style={styles.inputPickerWrapper}>
            <Picker
              selectedValue={grade}
              onValueChange={(itemValue: string) => {
                setGrade(itemValue);
                // Konversi grade ke gradePoints otomatis
                const gradeMap: {[key: string]: string} = {
                  'A': '4.00',
                  'A-': '3.75',
                  'B+': '3.50',
                  'B': '3.00',
                  'B-': '2.75',
                  'C+': '2.50',
                  'C': '2.00',
                  'C-': '1.75',
                  'D': '1.00',
                  'E': '0.00',
                };
                setGradePoints(gradeMap[itemValue] || '');
              }}
              style={styles.inputPicker}
              dropdownIconColor="#4B2354"
              mode="dropdown"
            >
              <Picker.Item label="Select Grade" value="" color="#8D92A3" />
              <Picker.Item label="A" value="A" color="#000" />
              <Picker.Item label="A-" value="A-" color="#000" />
              <Picker.Item label="B+" value="B+" color="#000" />
              <Picker.Item label="B" value="B" color="#000" />
              <Picker.Item label="B-" value="B-" color="#000" />
              <Picker.Item label="C+" value="C+" color="#000" />
              <Picker.Item label="C" value="C" color="#000" />
              <Picker.Item label="C-" value="C-" color="#000" />
              <Picker.Item label="D" value="D" color="#000" />
              <Picker.Item label="E" value="E" color="#000" />
            </Picker>
          </View>
          <Gap height={16} />
          <View style={styles.inputPickerWrapper}>
            <Picker
              selectedValue={credits}
              onValueChange={(itemValue: string) => setCredits(itemValue)}
              style={styles.inputPicker}
              dropdownIconColor="#4B2354"
              mode="dropdown"
            >
              <Picker.Item label="Select Credits" value="" color="#8D92A3" />
              <Picker.Item label="1" value="1" color="#000" />
              <Picker.Item label="2" value="2" color="#000" />
              <Picker.Item label="3" value="3" color="#000" />
              <Picker.Item label="6" value="6" color="#000" />
            </Picker>
          </View>
          <Gap height={16} />
        </View>
        <Button 
          text="ALREADY DONE" 
          onPress={handleAlreadyDone} 
          color="#FFFFFF" 
          buttonColor="#4B2354" 
          radius={22} 
          iconOnly={false} 
          icon={null} 
        />
        <Gap height={16} />
        <Button 
          text="IN PROGRESS" 
          onPress={handleInProgress} 
          color="#FFFFFF" 
          buttonColor="#4B2354" 
          radius={22} 
          iconOnly={false} 
          icon={null} 
        />
        <Gap height={30} />
      </ScrollView>
    </View>
  );
};

export default Subject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B2354',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  form: {
    marginBottom: 30,
  },
  inputPickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  inputPicker: {
    color: '#000',
    fontSize: 16,
    width: '100%',
    height: 48,
    backgroundColor: '#FAFAFA',
  },
}); 