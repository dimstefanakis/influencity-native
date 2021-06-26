import React from 'react';
import {
  AccessibilityProps,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

export default function Button({
  title,
  variant = 'default',
  disabled,
  loading,
  onPress,
  ...props
}) {
  const theme = useTheme();
  const titleElement = React.isValidElement(title) ? (
    title
  ) : (
    <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
      {title}
    </Text>
  );
  return (
    <View style={disabled && styles.disabled}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.container,
          variant === 'primary' && styles.primaryContainer,
          {backgroundColor: theme.colors.primary},
        ]}
        onPress={onPress}
        {...props}>
        {loading ? (
          <ActivityIndicator animating color="black" size="small" />
        ) : (
          titleElement
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 4,
  },
  primaryContainer: {
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  textPrimary: {
    color: 'black',
  },
  disabled: {
    opacity: 0.3,
  },
});
