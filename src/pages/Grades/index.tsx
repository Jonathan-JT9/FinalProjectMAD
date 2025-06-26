import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Gap } from '../../components/atoms';

const gradesData = [
  {
    color: '#FFD600',
    subject: 'Mobile Application Development',
    teacher: 'Stenly Adam',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
  {
    color: '#00C9A7',
    subject: 'Data Structure and Algorithms',
    teacher: 'Lidya Loch',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
  {
    color: '#2196F3',
    subject: 'Computer Network',
    teacher: 'Yuan Mambu',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
  {
    color: '#FF5252',
    subject: 'Database Management Systems',
    teacher: 'Marchell Tombang',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
  {
    color: '#A259FF',
    subject: 'Software Engineering',
    teacher: 'Stenly Fungus',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
  {
    color: '#6A6AFF',
    subject: 'Research Method',
    teacher: 'Andrew Liem',
    gradePoints: '4.00',
    credits: 3,
    grade: 'A',
    status: 'Graded',
  },
];

const Grades = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button iconOnly icon="back" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>GRADES</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 24}}>
        <Gap height={8} />
        <View style={styles.performanceCard}>
          <Text style={styles.performanceText}>ACADEMIC PERFORMANCE</Text>
        </View>
        <Gap height={16} />
        {gradesData.map((item, idx) => (
          <View style={styles.gradeCard} key={idx}>
            <View style={[styles.iconBox, {backgroundColor: item.color}]} />
            <View style={{flex: 1}}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.teacher}>{item.teacher}</Text>
              <View style={styles.row}>
                <Text style={styles.gradePoints}>Grade Points : {item.gradePoints}</Text>
                <View style={styles.gradeInfo}>
                  <Text style={styles.grade}>{item.grade}</Text>
                  <Text style={styles.credits}>{item.credits} Credits</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        <Gap height={16} />
        <Button text="DONE" color="#4B2354" buttonColor="#fff" radius={22} iconOnly={false} icon={null} />
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
    backgroundColor: '#fff',
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
  performanceCard: {
    backgroundColor: '#4B2354',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 8,
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
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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