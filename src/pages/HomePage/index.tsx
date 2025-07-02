import React, {useEffect, useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Easing} from 'react-native';
import {Button, Gap} from '../../components/atoms';
import {getDatabase, ref, child, get, onValue} from 'firebase/database';
import {Loading} from '../../components/molecules';
import {getAuth, signOut} from 'firebase/auth';
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
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  // Motivational quotes
  const quotes = [
    "Success is not final, failure is not fatal.",
    "The best way to get started is to quit talking and begin doing.",
    "Don't watch the clock; do what it does. Keep going.",
    "Great things never come from comfort zones.",
    "Push yourself, because no one else is going to do it for you.",
    "Dream it. Wish it. Do it.",
    "Stay positive, work hard, make it happen.",
  ];
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  return (
    <>
      <View style={styles.modernBackground}>
        {/* Decorative Shapes */}
        <View style={styles.shapeCircle1} />
        <View style={styles.shapeCircle2} />
        <View style={styles.shapeOval1} />
        <View style={styles.shapeDot1} />
        <View style={styles.bgCircle} />
        <View style={styles.cardWrapper}>
          <View style={styles.profileCard}> 
            {/* Gradient overlay */}
            <View style={styles.gradientOverlay} pointerEvents="none" />
            <View style={styles.profilePhotoWrapper}>
              <Image source={photo} style={styles.photo} />
              <View style={styles.badgeStar}>
                <Text style={styles.badgeStarText}>★</Text>
              </View>
            </View>
            <Text style={styles.subTitle}>WELCOME</Text>
            <Text style={styles.name}>{`Hi, ${firstName || 'No Name Found'}`}</Text>
            <Text style={styles.motivText}>Keep learning and growing every day!</Text>
            <Text style={styles.todayText}>{today}</Text>
            {/* Motivational Quote */}
            <Text style={styles.quoteText}>{quote}</Text>
            {/* Colorful accent line */}
            <View style={styles.colorAccentLine} />
          </View>
        </View>
        <View style={{alignItems: 'center', marginBottom: 16}}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={async () => {
              setLoading(true);
              try {
                console.log('Signing out...');
                await signOut(getAuth());
                setLoading(false);
                console.log('Navigating to SplashScreen');
                try {
                  navigation.reset({ index: 0, routes: [{ name: 'SplashScreen' }] });
                } catch (navErr) {
                  console.log('navigation.reset error:', navErr);
                  navigation.replace('SplashScreen');
                }
              } catch (e) {
                setLoading(false);
                console.log('Logout error:', e);
              }
            }}
          >
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerModern}>
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Home')}>
            <View style={styles.activeIconBg}>
              <Image
                source={require('../../assets/Home.png')}
                style={styles.iconActive}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.profileNavWrapper}>
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Profile')}>
              <Image
                source={require('../../assets/Profile.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Grades', { uid })}>
            <Image
              source={require('../../assets/Certificates.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {/* Garis aksen bawah bottom nav */}
        <View style={styles.bottomAccentLine} />
      </View>
      {loading && <Loading />}
    </>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  modernBackground: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#e9d5ff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#c4b5fd',
    marginTop: 40,
    marginBottom: 24,
  },
  subTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2d0c57',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 18,
    letterSpacing: 1,
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#6a11cb',
    marginTop: 10,
    fontWeight: '600',
  },
  photo: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#a18cd1',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#70218B',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 24,
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  footerModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#fff',
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
  motivText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginHorizontal: 40,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 1,
  },
  activeNavItem: {
    alignItems: 'center',
  },
  activeIconBg: {
    backgroundColor: '#f3e9ff',
    borderRadius: 16,
    padding: 6,
    marginBottom: -6,
  },
  bgCircle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 60,
    left: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#a18cd133',
    zIndex: 0,
  },
  profilePhotoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeStarText: {
    color: '#fbc02d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayText: {
    marginTop: 8,
    fontSize: 13,
    color: '#a18cd1',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  quoteText: {
    marginTop: 18,
    fontSize: 15,
    color: '#4B2354',
    fontFamily: 'Poppins-Italic',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.85,
  },
  profileNavWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAccentLine: {
    height: 3,
    backgroundColor: '#a18cd1',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 6,
    opacity: 0.25,
  },
  shapeCircle1: {
    position: 'absolute',
    top: 30,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#c4b5fd55', // ungu pastel transparan
    zIndex: 0,
  },
  shapeCircle2: {
    position: 'absolute',
    bottom: 60,
    right: -30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#a78bfa55', // ungu pastel transparan
    zIndex: 0,
  },
  shapeOval1: {
    position: 'absolute',
    top: 180,
    right: -60,
    width: 140,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#a18cd144', // ungu pastel transparan
    transform: [{ rotate: '18deg' }],
    zIndex: 0,
  },
  shapeDot1: {
    position: 'absolute',
    bottom: 120,
    left: 30,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#a78bfa55', // ungu pastel transparan
    zIndex: 0,
  },
  colorAccentLine: {
    height: 5,
    width: 120,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 2,
    backgroundColor: '#a18cd1', // ungu pastel solid
    opacity: 0.7,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
});
