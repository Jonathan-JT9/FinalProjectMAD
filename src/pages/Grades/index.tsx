import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Gap } from '../../components/atoms';
import { getDatabase, ref, onValue } from 'firebase/database';
import App from '../../config/Firebase';
import { getAuth } from 'firebase/auth';
import { useMemo } from 'react';

interface GradeItem {
  color?: string;
  subject: string;
  teacher: string;
  gradePoints: string;
  credits: string;
  grade: string;
  status: string;
}

const Grades = ({ navigation }: { navigation: any }) => {
  const userId = getAuth().currentUser?.uid;
  const [gradesData, setGradesData] = React.useState<GradeItem[]>([]);

  React.useEffect(() => {
    const db = getDatabase(App);
    const subjectsRef = ref(db, `users/${userId}/subjects`);
    const unsubscribe = onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data) as GradeItem[];
        setGradesData(arr);
      } else {
        setGradesData([]);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  // GPA calculation
  const { gpa, completed, total } = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    let completed = 0;
    gradesData.forEach(item => {
      const points = parseFloat(item.gradePoints);
      const credits = parseFloat(item.credits);
      if (!isNaN(points) && !isNaN(credits)) {
        totalPoints += points * credits;
        totalCredits += credits;
        completed++;
      }
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    return { gpa, completed, total: gradesData.length };
  }, [gradesData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button iconOnly icon="back" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <Text style={styles.headerTitle}>GRADES</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 24}}>
        <Gap height={8} />
        {/* Academic Performance Card */}
        <View style={styles.academicCard}>
          <Text style={styles.academicTitle}>ACADEMIC PERFORMANCE</Text>
          <Text style={styles.gpaLabel}>CURRENT GPA</Text>
          <Text style={styles.gpaValue}>{gpa.toFixed(2)}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width: `${(gpa/4)*100}%`}]} />
          </View>
          <Text style={styles.gpaScale}>Scale: 0.00 - 4.00</Text>
          <Text style={styles.subjectsInfo}>{completed} of {total} subjects completed</Text>
        </View>
        <Gap height={16} />
        {gradesData.map((item, idx) => (
          <View style={styles.gradeCardModern} key={idx}>
            <Text style={styles.subjectModern}>{item.subject}</Text>
            <Text style={styles.statusModern}>{item.status}</Text>
            <Text style={styles.teacherModern}>{item.teacher}</Text>
            <View style={styles.rowModern}>
              <Text style={styles.gradePointsModern}>Grade Points: {item.gradePoints}</Text>
              <View style={styles.gradeInfoModern}>
                <Text style={styles.gradeModern}>{item.grade}</Text>
                <Text style={styles.creditsModern}>{item.credits} Credits</Text>
              </View>
            </View>
          </View>
        ))}
        <Gap height={16} />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('HomePage')}>
          <Image
            source={require('../../assets/Home.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../assets/Profile.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Grades')}>
          <Image
            source={require('../../assets/Certificates.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Grades;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e9ff',
    paddingHorizontal: 16,
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
  academicCard: {
    backgroundColor: '#4B2354',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  academicTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  gpaLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  gpaValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressBarBg: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: 16,
    marginBottom: 8,
  },
  progressBarFill: {
    backgroundColor: '#E6F9EA',
    borderRadius: 8,
    height: '100%',
  },
  gpaScale: {
    color: '#fff',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subjectsInfo: {
    color: '#fff',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gradeCardModern: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  subjectModern: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4B2354',
    marginBottom: 4,
  },
  statusModern: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#a18cd1',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  teacherModern: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  rowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradePointsModern: {
    fontSize: 13,
    color: '#888',
  },
  gradeInfoModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeModern: {
    backgroundColor: '#E6F9EA',
    color: '#22C55E',
    fontWeight: '700',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  creditsModern: {
    backgroundColor: '#F3F3F3',
    color: '#888',
    fontWeight: '700',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
}); 
