import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from '../../components/molecules';
import {Button, Gap} from '../../components/atoms';
import BackIcon from '../../assets/arrow-back.svg';
import MailIcon from '../../assets/mail.svg';
import LockIcon from '../../assets/lock.svg';
import PersonIcon from '../../assets/person.svg';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, set} from 'firebase/database';
import {Loading} from '../../components/molecules';

const SignUp = ({navigation}) => {
  const [photo, setPhoto] = useState(require('../../assets/Icon.png'));
  const [photoForDB, setPhotoForDB] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [religion, setReligion] = useState('');
  const [birth, setBirth] = useState('');
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
      includeBase64: true,
    });

    console.log(result);
    if (result.didCancel) {
      showMessage({
        message: 'Ups, sepertinya anda tidak memilih foto',
        type: 'danger',
      });
    } else {
      const assets = result.assets[0];
      const base64 = `data: ${assets.type};base64, ${assets.base64}`;
      setPhoto({uri: base64});
      setPhotoForDB(base64);
    }
  };

  const onSubmit = () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      religion: religion,
      photo: photoForDB,
      birth: birth,
      subjects: {},
    };
    const auth = getAuth();
    const db = getDatabase();
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        // Simpan ke dalam real time database
        set(ref(db, 'users/' + user.uid), data);
        setLoading(false);
        showMessage({
          message: 'Registrasi berhasil, silahkan login',
          type: 'success',
        });
        navigation.navigate('SignIn');
      })
      .catch(error => {
        const errorMessage = error.message;
        setLoading(false);
        showMessage({
          message: errorMessage,
          type: 'danger',
        });
      });
  };

  return (
    <>
      <View style={styles.pageContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={20} />
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerText}>REGISTER</Text>
            <View style={{width: 24}} />
          </View>

          <Gap height={40} />
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.subTitle}>Unklab Student Profile</Text>

          <Gap height={24} />
          <View style={styles.profileContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={openCamera}>
              <View style={styles.profileBorder}>
                <Image
                  source={photo}
                  style={{width: 90, height: 90, borderRadius: 45}}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Gap height={16} />
          <View style={styles.formContainer}>
            <TextInput
              placeholder="First name"
              value={firstName}
              onChangeText={value => setFirstName(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Last name"
              value={lastName}
              onChangeText={value => setLastName(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={value => setPassword(value)}
              secureTextEntry={true}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={value => setPhone(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={value => setAddress(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Religion"
              value={religion}
              onChangeText={value => setReligion(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={16} />
            <TextInput
              placeholder="Birth"
              value={birth}
              onChangeText={value => setBirth(value)}
              icon={<PersonIcon width={20} height={20} />}
            />
            <Gap height={32} />
            <Button
              text="REGISTER NOW"
              onPress={onSubmit}
              buttonColor="#FFFFFF"
              color="#4B2354"
              radius={50}
              iconOnly={null}
              icon={null}
            />
            <Gap height={25} />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.bottomText}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
          <Gap height={20} />
        </ScrollView>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f3e9ff',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  headerText: {
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
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileBorder: {
    height: 105,
    width: 105,
    borderColor: '#8D92A3',
    borderStyle: 'dashed',
    borderRadius: 52.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    marginTop: 16,
  },
  bottomText: {
    textAlign: 'center',
    color: '#8D92A3',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
