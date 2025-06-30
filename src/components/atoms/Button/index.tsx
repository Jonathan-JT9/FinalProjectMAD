import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { BackButton } from '../../../assets';

interface ButtonProps {
  text?: string;
  color?: string;
  buttonColor?: string;
  iconOnly?: boolean;
  icon?: string;
  onPress: () => void;
  radius?: number;
}

const Button = ({
  text = '',
  color = '#FFFFFF',
  buttonColor = '#4B2354',
  iconOnly = false,
  icon,
  onPress,
  radius = 50,
}: ButtonProps) => {
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
        style={[
          styles.button,
          { backgroundColor: color, borderRadius: radius },
        ]}
        activeOpacity={0.85}
        onPress={onPress}>
        <Text style={[styles.buttonText, { color: buttonColor }]}>{text}</Text>
      </TouchableOpacity>
    );
  }
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
