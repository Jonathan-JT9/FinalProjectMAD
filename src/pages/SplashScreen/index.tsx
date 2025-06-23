import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Unklab } from '../../assets';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('SignIn');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Unklab} style={styles.logo} />
      <Text style={styles.text}>Unklab Student Profile</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#70218B',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 103,
    height: 103,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
});
