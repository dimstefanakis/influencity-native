/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Button,
  Title,
  Checkbox,
  Chip,
  Text,
  Subheading,
  useTheme,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

function SelectTier({route}) {
  const {handleCreateItems} = route.params;
  const {myTiers} = useSelector((state) => state.tiers);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getTierValuesAndCreateItems() {
    // backend accepts array of tier ids
    // will fix this soon, temporary hack for now
    let tierValues = selectedTier.length == 0 ? [] : [selectedTier.id]; //selectedTiers.map((t) => t.id);
    await handleCreateItems(tierValues, setLoading);
  }

  return (
    <ScrollView
      contentContainerStyle={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
      }}>
      {myTiers.map((t) => {
        return (
          <Tier
            tier={t}
            label={t.label}
            subheading={t.subheading}
            selectedTier={selectedTier}
            setSelectedTiers={setSelectedTiers}
            setSelectedTier={setSelectedTier}
          />
        );
      })}
      <Button
        icon="plus-circle"
        mode="contained"
        contentStyle={{padding: 10}}
        style={{borderRadius: 50, width: 200, margin: 20}}
        onPress={() => getTierValuesAndCreateItems(myTiers)}
        loading={loading}>
        Finish post
      </Button>
    </ScrollView>
  );
}

function Tier({
  tier,
  selectedTier,
  setSelectedTiers,
  setSelectedTier,
  style = {},
}) {
  const theme = useTheme();
  const selected = tier.label == selectedTier?.label;

  function handleSelect() {
    if (selected) {
      setSelectedTier(null);
    } else {
      setSelectedTier(tier);
    }
  }
  useEffect(() => {}, [selected]);

  return (
    <View
      style={{
        margin: 10,
        borderRadius: 100,
        width: '80%',
        height: 100,
        borderColor: '#eee',
        borderWidth: selected  ? 0 : 1,
        backgroundColor: selected ? theme.colors.primary : 'transparent',
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback useForeground onPress={handleSelect}>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 30,
                //color: selected ? theme.colors.primary : 'black',
              }}>
              {tier.label}
            </Text>
            {tier.subheading ? (
              <Subheading>{tier.subheading}</Subheading>
            ) : null}
          </View>
          <View style={{position: 'absolute', right: 30}}>
            {selected ? (
              <Icon name="checkbox-marked-circle" size={30} color="#00BBF9" />
            ) : (
              <Icon
                name="checkbox-blank-circle-outline"
                size={30}
                color="#eee"
              />
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default SelectTier;
