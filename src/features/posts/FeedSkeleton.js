/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function FeedSkeleton({count = 4}) {
  return (
    <View style={{padding: 20, flex: 1}}>
      <SkeletonPlaceholder>
        {[...Array(count)].map((_, i) => {
          return (
            <View style={{marginTop: 30}}>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item
                  width={60}
                  height={60}
                  borderRadius={50}
                />
                <SkeletonPlaceholder.Item marginLeft={20}>
                  <SkeletonPlaceholder.Item
                    width={120}
                    height={20}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={20}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
              <View style={{marginTop: 20}}>
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width - 40}
                  height={200}
                  borderRadius={4}
                />
              </View>
            </View>
          );
        })}
      </SkeletonPlaceholder>
    </View>
  );
}

export default FeedSkeleton;
