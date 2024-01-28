import { Button, View, Platform, StyleSheet, Text, } from 'react-native';
import { Image } from 'expo-image';
import logo from "@assets/corn-variety-splash-screen.png";

const Spacer = ({
    size,
    axis,
    style = {},
    ...delegated
  }) => {
    const width = axis === 'vertical' ? 1 : size;
    const height = axis === 'horizontal' ? 1 : size;
    return (
      <View
        style={{
          display: 'block',
          width,
          minWidth: width,
          height,
          minHeight: height,
          ...style,
        }}
        {...delegated}
      />
    );
  };


const Container = ({
  style = {},
  ...delegated
}) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        ...style
      }}
      {...delegated}
    />
  );
};

const LogoBox = ({
  style = {},
}) =>  {
  return (
    <View style={{ width: '190%', maxWidth: '250', height: '100', marginLeft: 'auto', marginRight: 'auto', ...style}}>
      <Image source={logo} style={{ width: '50%', height: '50%' }} />
    </View>
  );
};
export {
    Spacer, Container, LogoBox
};