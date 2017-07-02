'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import APIActions from './Actions/fetchRequestActions';

class SearchResults extends Component {
    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds,
            showProgress: true,
            searchQuery: props.searchQuery
        };
    }

    componentDidMount(){
        this.doSearch();
    }

    doSearch(){
        var url = 'https://api.github.com/search/repositories?q=' +
            encodeURIComponent(this.state.searchQuery);

        this.props.actions.fetchRequest(url)
            .then((response)=> response.json())
            .then((responseData)=> {
                this.setState({
                    repositories: responseData.repositories,
                    dataSource: this.state.dataSource
                        .cloneWithRows(responseData.items)
                });
            })
            .finally(()=> {
                this.setState({
                    showProgress: false
                });
            });
    }

    renderRow(rowData){
        return (
            <View style={{
                padding: 20,
                borderColor: '#D7D7D7',
                borderBottomWidth: 1,
                backgroundColor: '#fff'
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600'
                }}>
                    {rowData.full_name}
                </Text>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    marginBottom: 20
                }}>

                    <View style={styles.repoCell}>
                        <Image source={require('./img/star.png')}
                            style={styles.repoCellIcon}
                        ></Image>
                        <Text style={styles.repoCellLabel}>
                            {rowData.stargazers_count}
                        </Text>
                    </View>
                    <View style={styles.repoCell}>
                        <Image source={require('./img/fork.png')}
                            style={styles.repoCellIcon}
                        ></Image>
                        <Text style={styles.repoCellLabel}>
                            {rowData.forks}
                        </Text>
                    </View>
                    <View style={styles.repoCell}>
                        <Image source={require('./img/issues2.png')}
                            style={styles.repoCellIcon}
                        ></Image>
                        <Text style={styles.repoCellLabel}>
                            {rowData.open_issues}
                        </Text>
                    </View>

                </View>
            </View>
        );
    }

    render(){
      if(this.state.showProgress){
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    size="large"
                    animating={true} />
            </View>
        );
      }

      return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start'
        }}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)} />
        </View>
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
)(SearchResults);

var styles = StyleSheet.create({
    repoCell: {
        width: 50,
        alignItems: 'center'
    },
    repoCellIcon: {
        width: 20,
        height: 20
    },
    repoCellLabel: {
        textAlign: 'center'
    }
});

module.exports = SearchResults;
