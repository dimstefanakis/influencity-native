/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

function AlertBox({type = 'info', title, description}) {
  const theme = useTheme();

  if (type == 'warning') {
    return (
      <WarningBox>
        {title ? (
          <Text style={{...theme.fonts.medium, fontSize: 18}}>{title}</Text>
        ) : null}
        {description ? (
          <Text style={{marginTop: 10, textAlign: 'center'}}>
            {description}
          </Text>
        ) : null}
      </WarningBox>
    );
  }

  return null;
}

function WarningBox({children}) {
  const theme = useTheme();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.brandOrange,
      }}>
      {children}
    </View>
  );
}

export default AlertBox;
