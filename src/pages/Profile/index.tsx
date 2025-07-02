import {StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import React from 'react';
import {Gap} from '../../components/atoms';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Button} from '../../components/atoms';
import { MaterialIcons, FontAwesome5, Feather, Entypo } from '@expo/vector-icons';

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
      <View style={styles.softBg}>
        <ScrollView contentContainerStyle={{paddingBottom: 16}} showsVerticalScrollIndicator={false}>
          <Gap height={24} />
          <Text style={styles.pageTitle}>PROFILE</Text>
          <Gap height={24} />
          <Gap height={16} />
          <View style={styles.profileCardModern}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleChangePhoto} style={styles.profilePhotoWrapper}>
              <View style={styles.profilePhotoBorder}>
                <Image
                  source={profile?.photo ? { uri: profile.photo } : require('../../assets/Icon.png')}
                  style={styles.profilePhoto}
                />
              </View>
            </TouchableOpacity>
            <Gap height={10} />
            <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
            <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>Computer Science | Third Year</Text></View>
          </View>
          <View style={styles.infoContainerModern}>
            <View style={styles.infoItemModern}>
              <Text style={styles.infoTitleModern}>Email</Text>
              <Text style={styles.infoTextModern}>{profile?.email}</Text>
            </View>
            <View style={styles.infoItemModern}>
              <Text style={styles.infoTitleModern}>Birth</Text>
              <Text style={styles.infoTextModern}>{profile?.birth}</Text>
            </View>
            <View style={styles.infoItemModern}>
              <Text style={styles.infoTitleModern}>Address</Text>
              <Text style={styles.infoTextModern}>{profile?.address}</Text>
            </View>
            <View style={styles.infoItemModern}>
              <Text style={styles.infoTitleModern}>Phone</Text>
              <Text style={styles.infoTextModern}>{profile?.phone}</Text>
            </View>
            <View style={styles.infoItemModern}>
              <Text style={styles.infoTitleModern}>Religion</Text>
              <Text style={styles.infoTextModern}>{profile?.religion}</Text>
            </View>
          </View>
          <Button
            text="Add Subject"
            onPress={() => navigation.navigate('Subject')}
            color="#70218B"
            buttonColor="#fff"
            style={styles.addSubjectBtn}
          />
        </ScrollView>
      </View>
      <View style={styles.footerModern}>
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
    backgroundColor: '#f0f4f8',
  },
  softBg: {
    flex: 1,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#f3e9ff',
    overflow: 'hidden',
  },
  profileCardModern: {
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 28,
    marginHorizontal: 24,
    marginBottom: 18,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  profilePhotoWrapper: {
    padding: 4,
    borderRadius: 70,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  profilePhotoBorder: {
    borderWidth: 3,
    borderColor: '#a18cd1',
    borderRadius: 70,
    padding: 3,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3e9ff',
  },
  statusBadge: {
    backgroundColor: '#f3e9ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
  },
  statusBadgeText: {
    color: '#a18cd1',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  infoContainerModern: {
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 18,
    gap: 0,
  },
  infoItemModern: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#f8f6fc',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  infoTitleModern: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#a18cd1',
    marginBottom: 6,
  },
  infoTextModern: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#444',
    opacity: 0.85,
  },
  addSubjectBtn: {
    marginTop: 28,
    marginHorizontal: 32,
    borderRadius: 22,
    elevation: 3,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  footerModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 8,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    tintColor: '#a18cd1',
  },
  pageTitle: {
    fontFamily: 'Poppins-SemiBold',
    marginTop: -5,
    textAlign: 'center',
    fontSize: 14,
    color: '#4B2354',
    letterSpacing: 1,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
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
    fontSize: 16,
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
