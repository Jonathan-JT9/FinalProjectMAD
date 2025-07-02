import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from '../../components/molecules';
import {Button, Gap} from '../../components/atoms';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, child, get} from 'firebase/database';
import {showMessage} from 'react-native-flash-message';
import {Loading} from '../../components/molecules';
import MailIcon from '../../assets/mail.svg';
import LockIcon from '../../assets/lock.svg';

const SignIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const auth = getAuth();
    const db = getDatabase();
    // setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('userData from database:', userData);
          navigation.navigate('HomePage', {
            uid: user.uid,
            firstName: userData.firstName || 'User',
            photo: userData.photo || '',
          });
        } else {
          showMessage({
            message: 'Data pengguna tidak ditemukan di database.',
            type: 'danger',
          });
        }
        setLoading(false);
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'danger',
        });
      });
  };

  return (
    <>
      <View style={styles.pageContainer}>
        <Gap height={40} />

        <Text style={styles.loginTitle}>LOGIN</Text>
        <Gap height={24} />

        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.subTitle}>Unklab Student Profile</Text>
        <Gap height={20} />

        <View style={styles.contentContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={value => setEmail(value)}
            icon={<MailIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry={true}
            icon={<LockIcon width={20} height={20} />}
          />
          <Gap height={32} />

          <Button
            text="LOGIN"
            onPress={onSubmit}
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
      {loading && <Loading />}
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f3e9ff',
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
