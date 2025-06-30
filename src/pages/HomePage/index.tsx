import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Button, Gap} from '../../components/atoms';
import {getDatabase, ref, child, get, onValue} from 'firebase/database';
import {Loading} from '../../components/molecules';
import {getAuth} from 'firebase/auth';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: { uid?: string } | undefined;
  Profile: undefined;
  Grades: { uid?: string } | undefined;
};

type HomePageProps = {
  route: RouteProp<RootStackParamList, 'Home'>;
  navigation: any; // fallback to any to avoid linter error
};

const HomePage = ({route, navigation}: HomePageProps) => {
  const [photo, setPhoto] = useState(require('../../assets/Icon.png'));
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  let uid = route?.params?.uid;
  if (!uid) {
    uid = getAuth().currentUser?.uid;
  }
  if (!uid) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>User not found. Please login again.</Text>
      </View>
    );
  }
  useEffect(() => {
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
          setFirstName(data.firstName);
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  }, []);
  return (
    <>
      <View style={styles.pageContainer}>
        <View style={styles.contentWrapper}>
          <Text style={styles.subTitle}>WELCOME</Text>
          <Gap height={10} />
          <View style={styles.profileContainer}>
            <Image source={photo} style={styles.photo} />
            <Gap height={10} />
            <Text style={styles.name}>{`Hi, ${firstName || 'No Name Found'}`}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../../assets/Home.png')}
              style={styles.iconActive}
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
            onPress={() => navigation.navigate('Grades', { uid })}>
            <Image
              source={require('../../assets/Certificates.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerContainer: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
    paddingVertical: 37,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    color: '#020202',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  subTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    fontSize: 22,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  photo: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
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
});
