import {StyleSheet, TextInput as Input, View} from 'react-native';
import React from 'react';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}

const TextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  icon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focused]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Input
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888888"
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
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
    paddingHorizontal: 18,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  focused: {
    borderColor: '#6A1B9A',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    paddingVertical: 8,
  },
});
