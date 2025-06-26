import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from '../../components/molecules';
import {Button, Gap} from '../../components/atoms';
import BackIcon from '../../assets/arrow-back.svg';
import MailIcon from '../../assets/mail.svg';
import LockIcon from '../../assets/lock.svg';
import PersonIcon from '../../assets/person.svg';
import {launchCamera} from 'react-native-image-picker';

const SignUp = ({navigation}) => {
  const [photo, setPhoto] = useState(require('../../assets/Icon.png'));

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
      includeBase64: false,
    });
    if (result.didCancel) return;
    if (result.assets && result.assets.length > 0) {
      setPhoto({uri: result.assets[0].uri});
    }
  };

  return (
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
            icon={<PersonIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Last name"
            icon={<PersonIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Email"
            icon={<MailIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Password"
            secureTextEntry
            icon={<LockIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Phone"
            icon={<PersonIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Address"
            icon={<PersonIcon width={20} height={20} />}
          />
          <Gap height={16} />
          <TextInput
            placeholder="Religion"
            icon={<PersonIcon width={20} height={20} />}
          />
          <Gap height={32} />
          <Button
            text="REGISTER NOW"
            onPress={() => navigation.navigate('SignIn')}
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
  );
};

export default SignUp;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
