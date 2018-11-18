
import {
  FlatList, View, TextInput, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as _ from 'lodash';
// import { TextInput } from 'react-native-ui-lib';
import SuggestionListItem from './SuggestionListItem';
import suggest from './services/suggest';


let style;

class InputAutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], value: '' };

    this.searchList = this.searchList.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onPressItem = (id: string, name: string) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = this.props;
    const existingItem = { id, name };
    this.setState({
      value: name,
    });
    onDataSelectedChange(existingItem);
  };

  keyExtractor = item => item.id;

  async searchList(text) {
    const {
      keyPathRequestResult,
      itemFormat,
      apiEndpointSuggestData,
      onDataSelectedChange,
      staticData,
    } = this.props;
    this.setState({ value: text });
    let suggestData = null;
    if (staticData != null) {
      try {
        suggestData = suggest.searchForRelevant(text, staticData, itemFormat);
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    } else {
      try {
        suggestData = await suggest.searchForSuggest(
          text,
          apiEndpointSuggestData,
          keyPathRequestResult,
          itemFormat,
        );
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    }
    onDataSelectedChange(suggestData.existingItem);
    this.setState({
      data: suggestData.suggest,
    });
  }

  renderItem = ({ item }) => {
    const { itemTextStyle, itemTagStyle } = this.props;
    return (
      <SuggestionListItem
        textStyle={itemTextStyle}
        tagStyle={itemTagStyle}
        id={item.id}
        onPressItem={this.onPressItem}
        name={item.name}
        tags={item.tags}
      />
    );
  };

  render() {
    const { value, data } = this.state;
    const { inputStyle, flatListStyle } = this.props;
    return (
      <View style={style.container}>
        <TextInput
          style={[style.input, inputStyle]}
          value={value}
          clearButtonMode="while-editing"
          onChangeText={this.searchList}
        />
        <FlatList
          style={[style.flatList, flatListStyle]}
          data={data}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
InputAutoSuggest.propTypes = {
  inputStyle: PropTypes.shape({}),
  flatListStyle: PropTypes.shape({}),
  itemTextStyle: PropTypes.shape({}),
  itemTagStyle: PropTypes.shape({}),
  apiEndpointSuggestData: PropTypes.func,
  staticData: PropTypes.arrayOf(PropTypes.shape({})),
  onDataSelectedChange: PropTypes.func,
  keyPathRequestResult: PropTypes.string,
  itemFormat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};
InputAutoSuggest.defaultProps = {
  inputStyle: {},
  flatListStyle: {},
  itemTextStyle: { fontSize: 25 },
  itemTagStyle: { fontSize: 22 },
  staticData: null,
  apiEndpointSuggestData: () => _.noop,
  onDataSelectedChange: () => _.noop,
  keyPathRequestResult: 'suggest.city[0].options',
  itemFormat: {
    id: 'id',
    name: 'name',
    tags: [],
  },
};

style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  input: {
    fontSize: 22,
    borderBottomWidth: 1,
  },
  flatList: {},
  itemTextStyle: { fontSize: 30 },
});

export default InputAutoSuggest;
