import {StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput, Animated, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Gap} from '../../components/atoms';
import {getDatabase, ref, child, get, update} from 'firebase/database';
import {Loading} from '../../components/molecules';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';

interface ProfileProps {
  route: {
    params?: {
      uid?: string;
    };
  };
  navigation: any;
}

const {width, height} = Dimensions.get('window');

const Profile = ({route, navigation}: ProfileProps) => {
  const [photo, setPhoto] = useState(require('../../assets/Icon.png'));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [religion, setReligion] = useState('');
  const [birth, setBirth] = useState('');
  const [status, setStatus] = useState('Computer Science | Third Year');
  const [loading, setLoading] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState('');
  
  // Ambil uid dari route params jika ada, jika tidak gunakan dari HomePage
  const uid = route?.params?.uid || navigation.getState()?.routes?.find((r: any) => r.name === 'HomePage')?.params?.uid;

  // Animation for profile card
  const cardAnim = useState(new Animated.Value(0))[0];
  const infoAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
    Animated.spring(infoAnim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const showImagePicker = () => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Kamera',
          onPress: () => openCamera(),
        },
        {
          text: 'Galeri',
          onPress: () => openGallery(),
        },
      ],
      {cancelable: true}
    );
  };

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
      includeBase64: true,
    });

    console.log('Camera result:', result);
    handleImageResult(result);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
      includeBase64: true,
    });

    console.log('Gallery result:', result);
    handleImageResult(result);
  };

  const handleImageResult = (result: any) => {
    if (result.didCancel) {
      showMessage({
        message: 'Ups, sepertinya anda tidak memilih foto',
        type: 'danger',
      });
    } else if (result.assets && result.assets[0]) {
      const assets = result.assets[0];
      const base64 = `data: ${assets.type};base64, ${assets.base64}`;
      
      // Update state untuk preview
      setPhoto({uri: base64});
      
      // Update ke Firebase
      updateProfilePhoto(base64);
    }
  };

  const updateProfilePhoto = async (photoBase64: string) => {
    if (!uid) {
      showMessage({
        message: 'User ID tidak ditemukan',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);
    
    try {
      await update(userRef, {
        photo: photoBase64
      });
      
      showMessage({
        message: 'Foto profil berhasil diperbarui',
        type: 'success',
      });
      
      console.log('Profile photo updated successfully');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      showMessage({
        message: 'Gagal memperbarui foto profil',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditingStatus = () => {
    setTempStatus(status);
    setIsEditingStatus(true);
  };

  const saveStatus = async () => {
    if (!uid) {
      showMessage({
        message: 'User ID tidak ditemukan',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);
    
    try {
      await update(userRef, {
        status: tempStatus
      });
      
      setStatus(tempStatus);
      setIsEditingStatus(false);
      
      showMessage({
        message: 'Status berhasil diperbarui',
        type: 'success',
      });
      
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage({
        message: 'Gagal memperbarui status',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEditingStatus = () => {
    setIsEditingStatus(false);
    setTempStatus('');
  };

  useEffect(() => {
    if (uid) {
      setLoading(true);
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`))
        .then(snapshot => {
          setLoading(false);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setPhoto(
              data.photo ? {uri: data.photo} : require('../../assets/Icon.png'),
            );
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
            setReligion(data.religion || '');
            setBirth(data.birth || '');
            setStatus(data.status || 'Computer Science | Third Year');
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        });
    }
  }, [uid]);

  return (
    <>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FF', '#FFFFFF']}
        style={styles.pageContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.contentWrapper}>
          <Gap height={24} />
          <Text style={styles.pageTitle}>PROFILE</Text>
          <Gap height={24} />
          <Gap height={16} />
          <Animated.View style={[styles.profileCard, {
            opacity: cardAnim,
            transform: [{scale: cardAnim}],
          }]}> 
            <TouchableOpacity activeOpacity={0.5} onPress={showImagePicker}>
              <View style={styles.profilePhotoWrapper}>
                <View style={styles.profilePhotoRing} />
                <Image
                  source={photo}
                  style={styles.profilePhoto}
                />
                <View style={styles.profilePhotoGlow} />
              </View>
            </TouchableOpacity>
            <Gap height={10} />
            <Text style={styles.name}>{`${firstName} ${lastName}`.trim() || 'User'}</Text>
            {isEditingStatus ? (
              <View style={styles.statusEditContainer}>
                <TextInput
                  style={styles.statusInput}
                  value={tempStatus}
                  onChangeText={setTempStatus}
                  placeholder="Masukkan status (e.g., Computer Science | Third Year)"
                  placeholderTextColor="#8D92A3"
                />
                <View style={styles.statusEditButtons}>
                  <TouchableOpacity
                    style={styles.statusEditButton}
                    onPress={saveStatus}>
                    <Text style={styles.statusEditButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusEditButton, styles.cancelButton]}
                    onPress={cancelEditingStatus}>
                    <Text style={styles.statusEditButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                showMessage({ message: 'Edit status', type: 'info' });
                startEditingStatus();
              }}>
                <View style={styles.statusBadge}>
                  <Text style={styles.status}>{status}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
          <Animated.View style={[styles.infoCard, {
            opacity: infoAnim,
            transform: [{scale: infoAnim}],
          }]}> 
            <View style={styles.infoItem}><Text style={styles.infoTitle}>Email</Text><Text style={styles.infoText}>{email || 'No email available'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoTitle}>Birth</Text><Text style={styles.infoText}>{birth || 'No birth information available'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoTitle}>Address</Text><Text style={styles.infoText}>{address || 'No address available'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoTitle}>Phone</Text><Text style={styles.infoText}>{phone || 'No phone available'}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoTitle}>Religion</Text><Text style={styles.infoText}>{religion || 'No religion available'}</Text></View>
          </Animated.View>
        </View>
        <TouchableOpacity
          style={styles.addSubjectButton}
          onPress={() => navigation.navigate('Subject', {uid: uid})}>
          <Text style={styles.addSubjectButtonText}>Add Subject</Text>
        </TouchableOpacity>
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
            onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('../../assets/Profile.png')}
              style={styles.iconActive}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Grades', {uid: uid})}>
            <Image
              source={require('../../assets/Certificates.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {loading && <Loading />}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    // backgroundColor: '#FAFAFA',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#FAFAFA',
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
    elevation: 0,
    shadowColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(112,33,139,0.10)',
    position: 'relative',
  },
  profilePhotoWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    zIndex: 2,
  },
  profilePhotoRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#70218B',
    zIndex: 1,
  },
  profilePhotoGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(112,33,139,0.08)',
    zIndex: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(112,33,139,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCard: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(112,33,139,0.08)',
    // shadow removed for flat look
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
    flex: 1,
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
  statusEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  statusInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5AE2F',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  statusEditButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  statusEditButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E5AE2F',
  },
  statusEditButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
  },
  editIcon: {
    marginLeft: 8,
    fontSize: 12,
    opacity: 0.8,
  },
});
