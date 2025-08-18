import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { scale } from 'react-native-size-matters';

const FloatingButton = React.memo(({ onPress }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Entypo name="plus" size={35} color="white" />
  </TouchableOpacity>
));

export default FloatingButton;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: scale(60),
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: scale(30),
    bottom: scale(30),
    zIndex: 10,
  },
});
