import React from 'react';
import {
  Alert,
  FlatList,
  Text,
  View,
  ListView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Switch,
  TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import JourneyListItem from './JourneyListItem';
//TODO: MAKE THIS COMPONENT TAKE LIST ITEM AS A PROP AND REFACTOR THE OTEHR LIST COMPONENT

export default class JourneyList extends React.PureComponent {
  state = {
    selected: ( new Map()/*: Map<string, boolean> */)
  };

  data = _.uniqBy(Object.values(this.props.alarms), a => {
    return a.journey &&
    a.journey.destination &&
    a.journey.destination.info[0].feature;
  }).filter(a => {
    return a.journey !== null &&
    a.journey.destination !== null &&
    a.journey.destination.info[0].feature !== null;
  });

  _keyExtractor = (alarm, index) => alarm.id;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
    if (this.props.itemPressed)
    {
      this.props.itemPressed(id);
    }
  };

  _renderItem = ({item,index}) => {
    return (
      <JourneyListItem
        id={item.id}
        alarm={item}
        onPressItem={() => this._onPressItem(item.id)}
        selected={!!this.state.selected.get(item.id)}
      />
    );
  }

  render() {
    console.log(Object.values(this.props.alarms).map(a=>{
      return a.journey &&
      a.journey.destination &&
      a.journey.destination.info[0].feature;
    }));
    console.log(this.data);
    //TODO: FIx the issue where the journey clears itself if not the ifrst journey to be added. or something

    return (
      <FlatList
        data={this.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
