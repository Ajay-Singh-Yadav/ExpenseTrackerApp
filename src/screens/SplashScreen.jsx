import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import { moderateScale } from 'react-native-size-matters';

import { useTheme } from '../constants/ThemeContext';

const welcomeImage = require('../assets/images/welcome.png');

const SplashScreen = () => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.bgColor,
        },
        logo: {
          width: moderateScale(150),
          height: moderateScale(150),
          resizeMode: 'contain',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <FastImage
        source={welcomeImage}
        style={styles.logo}
        testID="splash-logo"
      />
    </View>
  );
};

export default React.memo(SplashScreen);
