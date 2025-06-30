import {StyleSheet, Text, View, TouchableOpacity, Image, Alert} from 'react-native';
import React from 'react';
import {Gap} from '../../components/atoms';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Profile = ({navigation}) => {
  const [profile, setProfile] = React.useState<any>(null);
  const userId = getAuth().currentUser?.uid;

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChangePhoto = () => {
    if (!userId) return;
    Alert.alert(
      'Change Profile Photo',
      'Choose photo source',
      [
        {
          text: 'Camera',
          onPress: () => handlePickPhoto('camera'),
        },
        {
          text: 'Gallery',
          onPress: () => handlePickPhoto('gallery'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePickPhoto = async (type: 'camera' | 'gallery') => {
    let result;
    if (type === 'camera') {
      result = await launchCamera({ mediaType: 'photo', maxWidth: 200, maxHeight: 200, quality: 0.7, includeBase64: true });
    } else {
      result = await launchImageLibrary({ mediaType: 'photo', maxWidth: 200, maxHeight: 200, quality: 0.7, includeBase64: true });
    }
    if (result.didCancel) return;
    const assets = result.assets && result.assets[0];
    if (!assets) return;
    const base64 = `data:${assets.type};base64,${assets.base64}`;
    const db = getDatabase();
    await update(ref(db, `users/${userId}`), { photo: base64 });
    setProfile((prev: any) => ({ ...prev, photo: base64 }));
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentWrapper}>
        <Gap height={24} />
        <Text style={styles.pageTitle}>PROFILE</Text>
        <Gap height={24} />
        <Gap height={16} />
        <View style={styles.profileContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleChangePhoto}>
            <Image
              source={profile?.photo ? { uri: profile.photo } : require('../../assets/Icon.png')}
              style={{width: 130, height: 120, borderRadius: 65}}
            />
          </TouchableOpacity>
          <Gap height={10} />
          <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={styles.status}>Computer Science | Third Year</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Email</Text>
            <Text style={styles.infoText}>{profile?.email}</Text>
            <Gap height={5} />
          </View>
          <Gap height={15} />
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Birth</Text>
            <Text style={styles.infoText}>{profile?.birth}</Text>
            <Gap height={5} />
          </View>
          <Gap height={15} />
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Address</Text>
            <Text style={styles.infoText}>{profile?.address}</Text>
            <Gap height={5} />
          </View>
          <Gap height={15} />
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Phone</Text>
            <Text style={styles.infoText}>{profile?.phone}</Text>
            <Gap height={5} />
          </View>
          <Gap height={15} />
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Religion</Text>
            <Text style={styles.infoText}>{profile?.religion}</Text>
            <Gap height={5} />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addSubjectButton}
        onPress={() => navigation.navigate('Subject')}>
        <Text style={styles.addSubjectButtonText}>Add Subject</Text>
      </TouchableOpacity>
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
            style={styles.iconActive}
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

export default Profile;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontFamily: 'Poppins-SemiBold',
    marginTop: -5,
    textAlign: 'center',
    fontSize: 14,
    color: '#4B2354',
    letterSpacing: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
  },
  status: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#E5AE2F',
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginTop: 30,
  },
  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    borderBottomRightRadius: 30,
    paddingVertical: 10,
    borderBottomLeftRadius: 30,
  },
  infoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#000',
    marginBottom: 4,
    marginLeft: 45,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#4F4F4F',
    marginLeft: 45,
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
  iconActive: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#6A1B9A',
  },
  addSubjectButton: {
    backgroundColor: '#4B2354',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 24,
  },
  addSubjectButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
