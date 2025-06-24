import { StyleSheet, TextInput as Input, View } from 'react-native';
import React from 'react';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}

const TextInput: React.FC<CustomTextInputProps> = ({ placeholder, secureTextEntry = false, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Input
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888888"
        style={styles.input}
      />
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
});
