/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function NotificationsSkeleton({count = 4}) {
  return (
    <View style={{padding: 20, flex: 1, height: '100%'}}>
      <SkeletonPlaceholder>
        <View>
          {[...Array(count)].map((_, i) => {
            return (
              <View style={{marginTop: 60}}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center">
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={60}
                    borderRadius={50}
                  />
                  <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item
                      width={Dimensions.get('window').width - 100}
                      height={50}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <View style={{marginTop: 20}}>
                  <SkeletonPlaceholder.Item
                    width={Dimensions.get('window').width - 40}
                    height={80}
                    borderRadius={4}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}

export default NotificationsSkeleton;
