/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function SearchSkeleton({count = 8}) {
  return (
    <SkeletonPlaceholder>
      <View>
        {[...Array(count)].map((_, i) => {
          return (
            <View style={{marginTop: 40}}>
              <SkeletonPlaceholder.Item flexDirection="row">
                <SkeletonPlaceholder.Item
                  width={60}
                  height={60}
                  borderRadius={50}
                />
                <SkeletonPlaceholder.Item marginLeft={20}>
                  <SkeletonPlaceholder.Item
                    width={180}
                    height={30}
                    borderRadius={4}
                  />
                  <View style={{marginTop: 10}}>
                    <SkeletonPlaceholder.Item
                      width={Dimensions.get('window').width - 100}
                      height={50}
                      borderRadius={4}
                    />
                  </View>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </View>
          );
        })}
      </View>
    </SkeletonPlaceholder>
  );
}

export default SearchSkeleton;
