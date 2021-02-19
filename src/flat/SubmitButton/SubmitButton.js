import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

function SubmitButton({
  loading = false,
  disabled = false,
  icon = null,
  circular = false,
  onPress = () => {},
  children,
}) {
  return (
    <Button
      icon={icon}
      mode="contained"
      style={styles.submitButton}
      loading={loading}
      onPress={onPress}
      disabled={disabled}
      contentStyle={{width: circular ? 40 : 200, height: 40}}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 40,
    marginTop: 30,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  circular: {
    width: 40,
    height: 40,
  },
});

export default SubmitButton;
