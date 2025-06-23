import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '../../atoms';

const Header = ({text, backButton, onPress}) => {
  if (backButton) {
    return (
      <View style={styles.container}>
        <Button iconOnly={true} icon="back" onPress={onPress} />
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
  },
  text: {
    color: '#020202',
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    marginLeft: 26,
    marginVertical: 38,
  },
});