import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity, Alert, Animated, Dimensions} from 'react-native';
import {Button, Gap} from '../../components/atoms';
import {getDatabase, ref, child, get, onValue} from 'firebase/database';
import {getAuth, signOut} from 'firebase/auth';
import {Loading} from '../../components/molecules';
import LinearGradient from 'react-native-linear-gradient';

interface HomePageProps {
  route: {
    params: {
      uid: string;
    };
  };
  navigation: any;
}

const {width, height} = Dimensions.get('window');

// const HomePage = ({navigation}) => {
const HomePage = ({route, navigation}: HomePageProps) => {
  const [photo, setPhoto] = useState(require('../../assets/Icon.png'));
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const {uid} = route.params;
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const popAnim = useState(new Animated.Value(0))[0];
  const bounceAnim = useState(new Animated.Value(0))[0];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            const auth = getAuth();
            signOut(auth)
              .then(() => {
                // Sign-out successful
                navigation.reset({
                  index: 0,
                  routes: [{name: 'SignIn'}],
                });
              })
              .catch((error) => {
                console.error('Error signing out:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              });
          },
        },
      ],
      {cancelable: true}
    );
  };

  useEffect(() => {
    setLoading(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${uid}`))
      .then(snapshot => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // setPhoto({uri: data.photo});
          console.log('data.photo:', data.photo);
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

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pop-up animation for profile card
    Animated.sequence([
      Animated.delay(500),
      Animated.spring(popAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous subtle bounce animation
    const continuousBounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 0.98,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    setTimeout(() => {
      continuousBounce.start();
    }, 2000);
  }, []);

  return (
    <>
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']}
        style={styles.pageContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        <View style={styles.contentWrapper}>
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={styles.welcomeBadge}>
          <Text style={styles.subTitle}>WELCOME</Text>
            </View>
            <Text style={styles.subtitleText}>Your Academic Journey Starts Here</Text>
          </Animated.View>
          
          <Gap height={30} />
          
          <Animated.View
            style={[
              styles.profileCard,
              {
                opacity: popAnim,
                transform: [
                  {scale: popAnim},
                  {translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })},
                ],
                shadowOpacity: popAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.25],
                }),
                shadowRadius: popAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ]}>
          <View style={styles.profileContainer}>
              <View style={styles.photoContainer}>
            <Image source={photo} style={styles.photo} />
                <View style={styles.photoGlow} />
                <View style={styles.photoRing} />
              </View>
              <Gap height={15} />
            <Text style={styles.name}>{`Hi, ${
              firstName || 'No Name Found'
            }`}</Text>
              <Text style={styles.statusText}>Student Portal</Text>
              <View style={styles.divider} />
              <Text style={styles.welcomeMessage}>Ready to explore your academic journey?</Text>
            </View>
          </Animated.View>
          
          <Gap height={40} />
          
        </View>
        
        <View style={styles.logoutContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              text="LOGOUT"
              onPress={handleLogout}
              color="#FFFFFF"
              buttonColor="#70218B"
              radius={22}
              iconOnly={false}
              icon={null}
            />
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
            onPress={() => navigation.navigate('Profile', {uid: uid})}>
            <Image
              source={require('../../assets/Profile.png')}
              style={styles.icon}
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

export default HomePage;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeBadge: {
    backgroundColor: '#70218B',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(112, 33, 139, 0.2)',
  },
  subTitle: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    color: '#70218B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 280,
    borderWidth: 2,
    borderColor: 'rgba(112, 33, 139, 0.3)',
  },
  profileContainer: {
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  photoGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 64,
    backgroundColor: 'rgba(112, 33, 139, 0.3)',
    zIndex: -1,
  },
  photoRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(112, 33, 139, 0.5)',
    zIndex: -2,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#70218B',
    marginTop: 10,
    textAlign: 'center',
  },
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#70218B',
    marginTop: 5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(112, 33, 139, 0.2)',
    width: '100%',
    marginVertical: 15,
  },
  welcomeMessage: {
    fontFamily: 'Poppins-Regular',
    color: '#70218B',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 2,
    borderColor: 'rgba(112, 33, 139, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
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
    tintColor: '#70218B',
  },
});
