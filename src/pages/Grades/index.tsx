import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Button, Gap } from '../../components/atoms';
import {getDatabase, ref, child, get, onValue} from 'firebase/database';
import {Loading} from '../../components/molecules';
import LinearGradient from 'react-native-linear-gradient';

interface GradesProps {
  route: {
    params?: {
      uid?: string;
    };
  };
  navigation: any;
}

interface SubjectData {
  id: string;
  subject: string;
  teacher: string;
  credits: number;
  grade: string;
  gradePoints: number;
  status: string;
  color: string;
  createdAt: number;
}

const {width, height} = Dimensions.get('window');
const maxBarWidth = Math.min(width - 64, 320); // responsive max width for GPA bar

const Grades = ({ route, navigation }: GradesProps) => {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const uid = route?.params?.uid;

  useEffect(() => {
    if (uid) {
      loadSubjects();
    }
  }, [uid]);

  const loadSubjects = () => {
    setLoading(true);
    const db = getDatabase();
    const subjectsRef = ref(db, `users/${uid}/subjects`);
    
    onValue(subjectsRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const subjectsArray: SubjectData[] = [];
        
        Object.keys(subjectsData).forEach((key) => {
          subjectsArray.push({
            id: key,
            ...subjectsData[key]
          });
        });
        
        // Sort by creation date (newest first)
        subjectsArray.sort((a, b) => b.createdAt - a.createdAt);
        setSubjects(subjectsArray);
      } else {
        setSubjects([]);
      }
    }, (error) => {
      setLoading(false);
      console.error('Error loading subjects:', error);
    });
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Graded' : 'In Progress';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? '#4CAF50' : '#FF9800';
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return 0;
    
    const completedSubjects = subjects.filter(subject => subject.status === 'completed');
    if (completedSubjects.length === 0) return 0;
    
    const totalGradePoints = completedSubjects.reduce((sum, subject) => {
      return sum + (subject.gradePoints * subject.credits);
    }, 0);
    
    const totalCredits = completedSubjects.reduce((sum, subject) => {
      return sum + subject.credits;
    }, 0);
    
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const gpa = calculateGPA();
  
  return (
    <View style={styles.container}>
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      <View style={styles.decorativeDot1} />
      <View style={styles.decorativeDot2} />
      <View style={styles.decorativeDot3} />
      
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <Button 
            text=""
            iconOnly={true} 
            icon="back" 
            onPress={() => navigation.goBack()} 
          />
        </View>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerTitle}>GRADES</Text>
          </View>
        </View>
        <View style={styles.spacerContainer}>
          <View style={{width: 50}} />
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 24}}>
        <Gap height={8} />
        
        <View style={styles.performanceCard}>
          <LinearGradient
            colors={['#A084E8', '#8F5FE8', '#7B2FF2', '#70218B']}
            style={styles.performanceGradient}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}>
            <Text style={styles.performanceText}>ACADEMIC PERFORMANCE</Text>
            <Gap height={12} />
            <View style={styles.gpaContainer}>
              <Text style={styles.gpaLabel}>CURRENT GPA</Text>
              <Text style={styles.gpaValue}>{gpa.toFixed(2)}</Text>
              <View style={styles.gpaBar}>
                <View 
                  style={[
                    styles.gpaBarFill, 
                    { width: maxBarWidth * (gpa / 4.0) },
                  ]} 
                />
              </View>
              <Text style={styles.gpaScale}>Scale: 0.00 - 4.00</Text>
              <Gap height={8} />
              <Text style={styles.gpaInfo}>
                {subjects.filter(s => s.status === 'completed').length} of {subjects.length} subjects completed
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        <Gap height={16} />
        
        {subjects.length > 0 ? (
          subjects.map((item, idx) => (
            <View style={styles.gradeCard} key={item.id}>
              <View style={[styles.iconBox, {backgroundColor: item.color}]}>
                <View style={styles.iconGlow} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.subject}>{item.subject}</Text>
                <Text style={styles.teacher}>{item.teacher}</Text>
                <View style={styles.row}>
                  <Text style={styles.gradePoints}>Grade Points : {item.gradePoints.toFixed(2)}</Text>
                  <View style={styles.gradeInfo}>
                    <Text style={styles.grade}>{item.grade}</Text>
                    <Text style={styles.credits}>{item.credits} Credits</Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📚</Text>
            </View>
            <Text style={styles.emptyText}>Belum ada mata kuliah</Text>
            <Text style={styles.emptySubtext}>Tambahkan mata kuliah di halaman Profile</Text>
          </View>
        )}
        
        <Gap height={16} />
        
        <View>
          <Button 
            text="DONE" 
            color="#FFFFFF" 
            buttonColor="#70218B" 
            radius={22} 
            iconOnly={false} 
            icon={null}
            onPress={() => navigation.goBack()}
          />
        </View>
        
        <Gap height={16} />
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('HomePage', {uid: uid})}>
          <Image
            source={require('../../assets/Home.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile', {uid: uid})}>
          <Image
            source={require('../../assets/Profile.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Grades', {uid: uid})}>
          <Image
            source={require('../../assets/Certificates.png')}
            style={styles.iconActive}
          />
        </TouchableOpacity>
      </View>
      {loading && <Loading />}
    </View>
  );
};

export default Grades;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 10,
    position: 'relative',
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#70218B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: '#4B2354',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceGradient: {
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 16,
  },
  performanceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gradeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(112, 33, 139, 0.1)',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
  },
  subject: {
    fontWeight: '700',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  teacher: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradePoints: {
    fontSize: 13,
    color: '#888',
  },
  gradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grade: {
    backgroundColor: '#E6F9EA',
    color: '#22C55E',
    fontWeight: '700',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  credits: {
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
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 2,
    borderColor: 'rgba(112, 33, 139, 0.3)',
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(112, 33, 139, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#888',
  },
  gpaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  gpaLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  gpaValue: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 32,
    marginTop: 8,
    marginBottom: 16,
  },
  gpaBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: maxBarWidth,
    height: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gpaBarFill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 20,
    minWidth: 20,
  },
  gpaScale: {
    color: '#fff',
    fontSize: 11,
    marginTop: 8,
    opacity: 0.8,
  },
  gpaInfo: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.9,
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  spacerContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(112, 33, 139, 0.2)',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F9EA',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F9EA',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F9EA',
  },
  decorativeDot1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  decorativeDot2: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  decorativeDot3: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconActive: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#70218B',
  },
}); 