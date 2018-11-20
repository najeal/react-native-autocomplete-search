### Intro / Preview

Component to search suggestion during you write a word. Based on a static data list or remote data. You can search suggestion in static data or fetching data suggestion from an api doing the work when you send the word you write. If suggestion is selected, an object ({ id: XX, name: XX }) is sent back to the parent component. The same occurs by simply write data corresponding to one suggestion. The component is usable with static data or data stored remotly like an elastic index using suggest feature (ex: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html).

<img src="https://raw.githubusercontent.com/najeal/react-native-autocomplete-search/master/examples/result_images/react-native-autocomplete-search-complex.png" width="300" height="250"/>

### Installation



**Install package via npm:**
```
  npm install react-native-react-native-autocomplete-search
```

or

**Install package via npm:**
```
yarn add react-native-autocomplete-search
```


### Usage
**Include the library in your code**
```
import { InputAutoSuggest } from 'react-native-autocomplete-search';
```

**Simple usage with static data**

```
<InputAutoSuggest
  style={{ flex: 1 }}
  staticData={[
    {id:'1', name:'Paris'},
    {id:'2', name: 'Pattanduru'},
    {id:'3', name: 'Para'},
    {id:'4', name:'London'},
    {id:'5', name:'New York'},
    {id:'6', name:'Berlin'}]}
/>
```

**Complex usage with static data**
```
<InputAutoSuggest
  style={{ flex: 1 }}
  staticData={[
    {someAttribute: 'val1', details: { id: '1', name:'Paris', country:'FR', continent:'Europe'}},
    {someAttribute: 'val2', details: { id: '2', name: 'Pattanduru', country:'PA', continent:'South America'}},
    {someAttribute: 'val3', details: { id: '3', name: 'Para', country:'PA', continent: 'South America'}},
    {someAttribute: 'val4', details: { id: '4', name:'London', country:'UK', continent: 'Europe'}},
    {someAttribute: 'val5', details: { id: '5', name:'New York', country: 'US', continent: 'North America'}},
    {someAttribute: 'val6', details: { id: '6', name:'Berlin', country: 'DE', continent: 'Europe'}},
   ]}
  itemFormat={{id: 'details.id', name: 'details.name', tags:['details.continent', 'details.country']}}
/>
```

itemFormat is used to give the path to the id, name and tags giving:

<img src="https://raw.githubusercontent.com/najeal/react-native-autocomplete-search/master/examples/result_images/react-native-autocomplete-search-complex.png" width="300" height="250"/>


**Simple usage with remote data fetching**

You can use the component to send the text you write and ask an api to make the suggestions. Just give your method calling the api to apiEndpointSuggestData prop instead of staticData.
```
<InputAutoSuggest
  style={{ flex: 1 }}
  apiEndpointSuggestData={text => YOUR-METHOD-CALLING-API(text)}
  itemFormat={{id: 'details.id', name: 'details.name', tags:['details.continent', 'details.country']}}
/>
```

**Get back the data selected to the parent component**

You can get back data information about the research by using the prop function 'onDataSelectedChange':
on object is passed as { id: XX, name: XX } or as null if there is not corresponding research information about the test.

```
<InputAutoSuggest
  style={{ flex: 1 }}
  apiEndpointSuggestData={text => YOUR-METHOD-CALLING-API(text)}
  itemFormat={{id: 'details.id', name: 'details.name', tags:['details.continent', 'details.country']}}
  onDataSelectedChange={data => console.log(data)}
/>
```
