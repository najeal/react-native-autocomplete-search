/* @flow */

import _ from 'lodash';

export type FormatDescribe = {
  id: string,
  name: string,
  tags?: ?Array<string>
};

export type SuggestionDescribe = {
  id: string,
  name: string,
  tags: ?Array<{item: string, id: string}>
}

export type SuggestData = {
  suggest: Array<SuggestionDescribe>,
  existingItem: ?{id:string, name:string}
}

function suggestFormat(
  datas: Array<{}>,
  itemFormat: FormatDescribe,
  text: string):SuggestData {
  let searching = true;
  let existingItem = null;
  let tags: ?Array<{item: string, id: string}> = null;
  const suggest: Array<SuggestionDescribe> = datas.map(
    (data:{}) => {
      const id = _.get(data, itemFormat.id);
      const name = _.get(data, itemFormat.name);
      tags = (itemFormat.tags != null) ? itemFormat.tags.map((tag, index) => ({
        item: _.get(data, tag),
        id: String(index),
      })) : null;
      // search text presence
      if (searching && (name === text)) {
        existingItem = { id, name };
        searching = false;
      }
      return { id, name, tags };
    },
  );
  return { suggest, existingItem };
}

async function searchForSuggest(text:string,
  apiEndpointSuggestData:(text: string)=>any,
  keyPathRequestResult:string,
  itemFormat:FormatDescribe) {
  const response = await apiEndpointSuggestData(text);
  const responseData = await response.json();
  return suggestFormat(_.get(responseData, keyPathRequestResult), itemFormat, text);
}

function searchForRelevant(
  text:string, items:Array<{}>,
  itemFormat:FormatDescribe):SuggestData {
  const suggest:Array<SuggestionDescribe> = [];
  let counter = 0;
  let existingItem = null;
  const reg = new RegExp(`^${text}`, 'iu');
  let tags: ?Array<{item: string, id: string}> = null;
  items.some((element) => {
    const name = _.get(element, itemFormat.name);
    if (reg.test(name)) {
      const id = _.get(element, itemFormat.id);
      if (!existingItem && text === name) {
        existingItem = { id, name };
      }
      tags = (itemFormat.tags != null)
      ? itemFormat.tags.map(
          (tag, index) => ({
        item: _.get(element, tag),
        id: String(index),
      }))
      : null;
      suggest.push({ id, name, tags });
      counter += 1;
      if (counter >= 5) {
        return true;
      }
    }
    return false;
  });
  return { suggest, existingItem };
}

export default { searchForSuggest, searchForRelevant };
