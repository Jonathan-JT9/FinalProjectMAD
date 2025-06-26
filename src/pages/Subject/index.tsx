import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Gap } from '../../components/atoms';
import { TextInput } from '../../components/molecules';
import BackIcon from '../../assets/arrow-back.svg';

const Subject = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button iconOnly icon="back" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>SUBJECT</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Input your subject this semester</Text>
        <Gap height={32} />
        <View style={styles.form}>
          <TextInput placeholder="Subject" />
          <Gap height={16} />
          <TextInput placeholder="Teacher Name" />
          <Gap height={16} />
          <TextInput placeholder="Credits" />
          <Gap height={16} />
          <TextInput placeholder="Your Grade" />
          <Gap height={16} />
          <TextInput placeholder="Grade Points" />
        </View>
        <Button text="ALREADY DONE" onPress={() => {}} color="#4B2354" buttonColor="#fff" radius={22} iconOnly={false} icon={null} />
        <Gap height={16} />
        <Button text="IN PROGRESS" onPress={() => {}} color="#4B2354" buttonColor="#fff" radius={22} iconOnly={false} icon={null} />
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