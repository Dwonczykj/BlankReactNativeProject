import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import {connect} from 'react-redux';
import APIActions from './Actions/fetchRequestActions';

import * as globals from './Common/globals';

export class MapSearchBox extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      error: null,
      searchText: "",
      loading: false
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.search= this.search.bind(this);

  }

  replaceSpacesWithPlusSign(queryString){
    return queryString.replace(/\s/g,"+");
  }

  search(event){
    const queryString = event.nativeEvent.text;


    let request = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.replaceSpacesWithPlusSign(queryString)}&key=${globals.mapsAPIKey}`;
    this.props.showProgress && this.props.showProgress(true);

    this.props.apiActions.fetchRequest(request)
      .then((response)=> {
          this.props.showProgress && this.props.showProgress(false);
          if(response.status >= 200 && response.status < 300){

              return response;
          }

          throw {
              badCredentials: response.status == 401,
              unknownError: response.status != 401
          }
      })
      .then((response)=> {
        return response.json();
      })
      .then((response)=> {
        //TODO: Show a list of returned results
        this.props.onSearch && this.props.onSearch(response.results[0]);
      })
      .catch((err)=> {
        debugger;
        this.props.showProgress && this.props.showProgress(false);
        this.setState({error: err});
        return cb(err);
      });
  }

  onChangeText(event){
    this.setState({searchText: event});
  }

  render(){
    return (
      <SearchBar
        lightTheme
        round
        containerStyle={this.props.containerStyle}
        inputStyle={this.props.inputStyle}
        showLoadingIcon={this.state.loading}
        onChangeText={this.onChangeText}
        onSubmitEditing={this.search}
        returnKeyType="search"
        value={this.state.searchText}
        placeholder={this.props.placeholder}/>
    );
  }
}

const mapStateToProps = (store) =>
{
  return {
    requestCount: store.requestCount
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    apiActions: APIActions(dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchBox);
