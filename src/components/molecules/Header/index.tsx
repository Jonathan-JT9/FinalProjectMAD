import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '../../atoms';

interface HeaderProps {
  text: string;
  backButton?: boolean;
  onPress?: () => void;
}

const Header = ({text, backButton = false, onPress}: HeaderProps) => {
  if (backButton) {
    return (
      <View style={styles.container}>
        <Button iconOnly={true} icon="back" onPress={onPress || (() => {})} text="" />
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  text: {
    color: '#020202',
    fontFamily: 'Poppins-Medium',
    fontSize: 23,
    marginLeft: 26,
    marginVertical: 0,
  },
});