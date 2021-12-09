import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {Text, useTheme} from 'react-native-paper';

function CircularProgressBar({progress, completedTasks, allTasks}) {
  const theme = useTheme();
  const radius = 40;
  const strokeWidth = 10;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * progress) / 100;

  return (
    <View style={{height: radius * 2, width: radius * 2}}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={theme.colors.primary}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.2}
          />
          <Circle
            cx="50%"
            cy="50%"
            stroke={theme.colors.primary}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>
          {completedTasks}/{allTasks}
        </Text>
      </View>
    </View>
  );
}

export default CircularProgressBar;
