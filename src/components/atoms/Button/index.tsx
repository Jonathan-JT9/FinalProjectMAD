import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { BackButton } from '../../../assets';

interface ButtonProps {
  text: string;
  color?: string;
  buttonColor?: string;
  iconOnly?: boolean;
  icon?: string | null;
  onPress?: () => void;
  radius?: number;
}

const Button = ({
  text,
  color = '#FFFFFF',
  buttonColor = '#4B2354',
  iconOnly = false,
  icon = null,
  onPress,
  radius = 22,
}: ButtonProps) => {
  if (iconOnly) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <View style={styles.buttonContainer as StyleProp<ViewStyle>}>
          {icon === 'back' && <BackButton />}
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[buttonStyle(buttonColor), { borderRadius: radius }]}
        activeOpacity={0.7}
        onPress={onPress}>
        <Text style={buttonTextStyle(color)}>{text}</Text>
      </TouchableOpacity>
    );
  }
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const buttonStyle = (color: string): ViewStyle => ({
  backgroundColor: color,
  paddingVertical: 14,
  justifyContent: 'center',
  alignItems: 'center',
});

const buttonTextStyle = (color: string): TextStyle => ({
  color,
  textAlign: 'center',
  fontFamily: 'Poppins-Bold',
  fontSize: 12,
  letterSpacing: 1,
  textTransform: 'uppercase',
});
