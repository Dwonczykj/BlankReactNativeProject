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
import FlatListItem from './FlatListItemContents';

import stringifyObject from 'stringify-object';

// class MyListItem extends React.PureComponent {
//   _onPress = () => {
//     this.props.onPressItem(this.props.id);
//   };
//
//   render() {
//     return (
//       <SomeOtherWidget
//         {...this.props}
//         onPress={this._onPress}
//       />
//     )
//   }
// }

export default class MyList extends React.PureComponent {
  state = {
    selected: ( new Map()/*: Map<string, boolean> */)
  };

  _keyExtractor = (alarm, index) => alarm.id;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));// toggle
      if(this.props.selectRow)
      {
        this.props.selectRow(this.props.alarms[id]);
      }
      return {selected};
    });
  };

  _renderItem = ({item,index}) => {

    return (
      <FlatListItem
        id={item.id}
        alarm={item}
        onPressItem={() => this._onPressItem(item.id)}
        displayClockSectionAs12HourTime={this.props.displayClockSectionAs12HourTime}
        toggleAlarm={this.props.toggleAlarm}
        selected={!!this.state.selected.get(item.id)}
      />
    );
  }

  render() {
    console.warn(stringifyObject(this.props, {
        indent: '  ',
        singleQuotes: false
      })
    );
    return (
      <FlatList
        data={Object.values(this.props.alarms).sort((alarm1,alarm2) => alarm1.time - alarm2.time)}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
