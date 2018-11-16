import _ from 'lodash';

function suggestFormat(datas, itemFormat, text) {
  let searching = true;
  let existingItem = null;
  const suggest = datas.map(
    (data) => {
      const id = _.get(data, itemFormat.id);
      const name = _.get(data, itemFormat.name);
      const tags = itemFormat.tags.map((tag, index) => ({
        item: _.get(data, tag),
        id: index,
      }));
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

async function searchForSuggest(text, apiEndpointSuggestData, keyPathRequestResult, itemFormat) {
  const response = await apiEndpointSuggestData(text);
  const responseData = await response.json();
  return suggestFormat(_.get(responseData, keyPathRequestResult), itemFormat, text);
}

function searchForRelevant(text, items, itemFormat) {
  const suggest = [];
  let counter = 0;
  let existingItem = null;
  const reg = new RegExp(`^${text}`, 'i', 'u');
  items.some((element) => {
    const name = _.get(element, itemFormat.name);
    if (reg.test(name)) {
      const id = _.get(element, itemFormat.id);
      if (!existingItem && text === name) {
        existingItem = { id, name };
      }
      const tags = itemFormat.tags.map((tag, index) => ({
        item: _.get(element, tag),
        id: index,
      }));
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
