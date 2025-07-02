import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button, Gap} from '../../components/atoms';
import {TextInput} from '../../components/molecules';
import BackIcon from '../../assets/arrow-back.svg';
import {getDatabase, ref, push} from 'firebase/database';
import App from '../../config/Firebase';
import {getAuth} from 'firebase/auth';
import {Picker} from '@react-native-picker/picker';
import Loading from '../../components/molecules/Loading';

const Subject = ({navigation}: {navigation: any}) => {
  const [subject, setSubject] = React.useState('');
  const [teacher, setTeacher] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [gradePoints, setGradePoints] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const userId = getAuth().currentUser?.uid;

  const gradeMap: {[key: string]: string} = {
    A: '4.00',
    'A-': '3.67',
    'B+': '3.33',
    B: '3.00',
    'B-': '2.67',
    'C+': '2.33',
    C: '2.00',
    'C-': '1.67',
    D: '1.00',
    E: '0.00',
    F: '0.00',
  };

  const gradeOptions = [
    {label: 'A (4.00)', value: 'A'},
    {label: 'A- (3.67)', value: 'A-'},
    {label: 'B+ (3.33)', value: 'B+'},
    {label: 'B (3.00)', value: 'B'},
    {label: 'B- (2.67)', value: 'B-'},
    {label: 'C+ (2.33)', value: 'C+'},
    {label: 'C (2.00)', value: 'C'},
    {label: 'C- (1.67)', value: 'C-'},
    {label: 'D (1.00)', value: 'D'},
    {label: 'E (0.00)', value: 'E'},
    {label: 'F (0.00)', value: 'F'},
  ];

  const creditOptions = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '6', value: '6'},
  ];

  React.useEffect(() => {
    const normalized = grade.trim().toUpperCase();
    setGradePoints(gradeMap[normalized] || '');
  }, [grade]);

  const handleSave = async (status: string, color: string) => {
    setLoading(true);
    const db = getDatabase(App);
    const data = {
      subject,
      teacher,
      credits,
      grade,
      gradePoints,
      status,
      color,
    };
    if (userId) {
      await push(ref(db, `users/${userId}/subjects`), data);
    }
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Grades', {uid: userId});
    }, 1000); // 1 detik loading
  };

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.header}>
        <Button iconOnly icon="back" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>SUBJECT</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
          <View
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              height: 56,
              justifyContent: 'center',
              marginBottom: 16,
            }}>
            <Picker
              selectedValue={credits}
              onValueChange={(itemValue: string) => setCredits(itemValue)}
              style={{height: 56, color: credits ? '#000' : '#888'}}>
              <Picker.Item label="Select Credits" value="" color="#888" />
              {creditOptions.map(opt => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              height: 56,
              justifyContent: 'center',
              marginBottom: 16,
            }}>
            <Picker
              selectedValue={grade}
              onValueChange={(itemValue: string) => setGrade(itemValue)}
              style={{height: 56, color: grade ? '#000' : '#888'}}>
              <Picker.Item label="Select Your Grade" value="" color="#888" />
              {gradeOptions.map(opt => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
        </View>
        <Button
          text="ALREADY DONE"
          onPress={() => handleSave('Graded', '#FFD600')}
          color="#4B2354"
          buttonColor="#fff"
          radius={22}
          iconOnly={false}
          icon=""
        />
        <Gap height={16} />
        <Button
          text="IN PROGRESS"
          onPress={() => handleSave('In Progress', '#BDBDBD')}
          color="#4B2354"
          buttonColor="#fff"
          radius={22}
          iconOnly={false}
          icon=""
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
});
