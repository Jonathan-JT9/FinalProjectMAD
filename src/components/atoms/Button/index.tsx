import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { BackButton } from '../../../assets';

const Button = ({
  text,
  color = '#FFFFFF',
  buttonColor = '#4B2354',
  iconOnly,
  icon,
  onPress,
  radius = 22,
}) => {
  if (iconOnly) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <View style={styles.buttonContainer}>
          {icon === 'back' && <BackButton />}
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[styles.button(color), { borderRadius: radius }]}
        activeOpacity={0.7}
        onPress={onPress}>
        <Text style={styles.buttonText(buttonColor)}>{text}</Text>
      </TouchableOpacity>
    );
  }
};

export default Button;

const styles = StyleSheet.create({
  button: color => ({
    backgroundColor: color,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  buttonText: color => ({
    color,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  }),
  buttonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
