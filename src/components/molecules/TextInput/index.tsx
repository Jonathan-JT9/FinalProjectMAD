import { StyleSheet, TextInput as Input, View } from 'react-native';
import React from 'react';

const TextInput = ({ placeholder, secureTextEntry = false, Icon }) => {
  return (
    <View style={styles.container}>
      {Icon && <Icon width={20} height={20} style={styles.icon} />}
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
