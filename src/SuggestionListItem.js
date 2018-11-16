import {
  View, Text, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class SuggestionListItem extends PureComponent {
  onPress = () => {
    const { name, id, onPressItem } = this.props;
    onPressItem(id, name);
  };

  render() {
    const {
      name, tags, textStyle, tagStyle,
    } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[{ flex: 2, color: 'black', fontSize: 16 }, textStyle]}>
            { name }
          </Text>
          {
            tags && tags.map(tag => (
              <Text key={tag.id} style={[{ color: 'grey', paddingRight: 5 }, tagStyle]}>
                { tag.item }
              </Text>
            ))
          }
        </View>
      </TouchableOpacity>
    );
  }
}
SuggestionListItem.propTypes = {
  textStyle: PropTypes.shape({}),
  tagStyle: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  onPressItem: PropTypes.func.isRequired,
};
SuggestionListItem.defaultProps = {
  tags: [],
  textStyle: {},
  tagStyle: {},
};

export default SuggestionListItem;
