import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from '../../components/molecules';
import {Button, Gap} from '../../components/atoms';

import MailIcon from '../../assets/mail.svg';
import LockIcon from '../../assets/lock.svg';

const SignIn = ({navigation}) => {
  return (
    <View style={styles.pageContainer}>
      <Gap height={40} />

      <Text style={styles.loginTitle}>LOGIN</Text>
      <Gap height={24} />

      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.subTitle}>Unklab Student Profile</Text>
      <Gap height={20} />

      <View style={styles.contentContainer}>
        <TextInput placeholder="Email" icon={<MailIcon width={20} height={20} />} />
        <Gap height={16} />
        <TextInput placeholder="Password" secureTextEntry icon={<LockIcon width={20} height={20} />} />
        <Gap height={32} />

        <Button
          text="LOGIN"
          onPress={() => navigation.navigate('HomePage')}
          buttonColor="#FFFFFF"
          color="#4B2354"
          radius={22}
          iconOnly={null}
          icon={null}
        />
        <Gap height={16} />
        <Button
          text="CREATE ACCOUNT"
          onPress={() => navigation.navigate('SignUp')}
          buttonColor="#FFFFFF"
          color="#4B2354"
          radius={22}
          iconOnly={null}
          icon={null}
        />
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#4B2354',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    marginTop: 35,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
  },
  contentContainer: {
    marginTop: 20,
  },
});
