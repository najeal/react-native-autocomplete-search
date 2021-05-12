import {
  FlatList, View, TextInput, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as _ from 'lodash';
import SuggestionListItem from './SuggestionListItem';
import suggest from './services/suggest';

let style;

class InputAutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], value: props.value };

    this.searchList = this.searchList.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.debounceSearch = _.debounce(this.searchList, 500);
  }

  onPressItem = (id: string, name: string) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = this.props;
    const existingItem = { id, name };
    this.setState({
      value: name,
      data: [],
    });
    onDataSelectedChange(existingItem);
  };

  keyExtractor = item => item.id;

  updateText = (text: string) => {
    this.setState({ value: text });
    this.debounceSearch(text);
  };

  async searchList(text) {
    const {
      keyPathRequestResult,
      itemFormat,
      apiEndpointSuggestData,
      onDataSelectedChange,
      staticData,
      maxNumberSuggestions
    } = this.props;
    let suggestData = null;
    if (staticData != null) {
      try {
        suggestData = suggest.searchForRelevant(text, staticData, itemFormat,maxNumberSuggestions);
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    } else {
      try {
        suggestData = await suggest.searchForSuggest(
          text,
          apiEndpointSuggestData,
          keyPathRequestResult,
          itemFormat
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
    const { containerStyle, inputStyle, flatListStyle, placeholder, placeholderTextColor, testID,autoFocus } = this.props;
    return (
      <View style={[style.container, containerStyle]}>
        <TextInput
          style={[style.input, inputStyle]}
          value={value}
          clearButtonMode="while-editing"
          onChangeText={this.updateText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          testID={testID}
          autoCorrect={false}
          autoFocus={autoFocus}
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
  maxNumberSuggestions:PropTypes.number,
  containerStyle: PropTypes.shape({}),
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
  testID: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  autoFocus:PropTypes.bool,
  value:PropTypes.string
};
InputAutoSuggest.defaultProps = {
  maxNumberSuggestions:5,
  containerStyle:{},
  inputStyle: {},
  flatListStyle: {},
  itemTextStyle: { fontSize: 25 },
  itemTagStyle: { fontSize: 22 },
  staticData: null,
  testID: null,
  placeholder: null,
  placeholderTextColor: null,
  apiEndpointSuggestData: () => _.noop,
  onDataSelectedChange: () => _.noop,
  keyPathRequestResult: 'suggest.city[0].options',
  itemFormat: {
    id: 'id',
    name: 'name',
    tags: [],
  },
  autoFocus:false,
  value:''
};

style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  input: {
    fontSize: 22,
    borderBottomWidth: 1,
    color: '#000000',
  },
  flatList: {},
  itemTextStyle: { fontSize: 30 },
});

export default InputAutoSuggest;
