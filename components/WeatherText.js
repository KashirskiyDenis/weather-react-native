import { StyleSheet, Text } from 'react-native';

function WeatherText({ style, isLight, children }) {
  return (
    <Text
      style={[
        { marginBottom: 2 },
        isLight ? styles.blackFont : styles.whiteFont,
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  whiteFont: {
    color: '#ffffff',
  },
  blackFont: {
    color: '#000000',
  },
});

export default WeatherText;
