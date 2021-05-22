/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function ExpertiseSkeleton({count = 4}) {
  return (
    <View style={{padding: 10, width: '100%'}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {[...Array(count)].map((_, i) => {
          return (
            <SkeletonPlaceholder key={i}>
              <View
                style={{
                  height: 130,
                  width: Dimensions.get('window').width * 0.42,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </SkeletonPlaceholder>
          );
        })}
      </View>
    </View>
  );
}

export default ExpertiseSkeleton;
