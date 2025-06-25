import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {DummyPhoto} from '../../assets';
import {Gap} from '../../components/atoms';

const HomePage = ({navigation}) => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.subTitle}>WELCOME</Text>
        <Gap height={10} />
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/Icon.png')}
            style={{width: 253, height: 232}}
          />
          <Gap height={10} />
          <Text style={styles.name}>JORYMO HADAM</Text>
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
          onPress={() => navigation.navigate('Certificates')}>
          <Image
            source={require('../../assets/Certificates.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Subjects')}>
          <Image
            source={require('../../assets/Subjects.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    // marginTop: 20,
  },
  photo: {
    height: 70,
    width: 70,
    borderRadius: 35,
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
