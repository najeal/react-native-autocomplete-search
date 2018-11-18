/* @flow */

import suggest from './suggest';
import type {FormatDescribe, SuggestData,SuggestionDescribe}  from './suggest';

describe('suggest searchForRelevant tests', () => {
  it('test path', () => {
    const res = suggest.searchForRelevant('', [{
      val: 'val1',
      details: {id: '1', name: 'val'}
    }],
      {id:'details.id', name:'details.name'});
    expect(res.suggest).toEqual(
      [{id: '1', name:'val', tags: null}]
    );
  });

  it('test path multiple data', () => {
    const input:Array<{}> = [{
      val: 'val1',
      details: {id: '1', name: 'val'}
    },{
      val: 'val2',
      details: {id: '2', name: 'val2'}
    }];
    const inputFormat:FormatDescribe = {
      id:'details.id',
      name:'details.name'
    };
    const res = suggest.searchForRelevant('', input, inputFormat);
    expect(res.suggest).toEqual(
      [{id: '1', name:'val', tags: null}, {id: '2', name:'val2', tags: null}]
    );
  });

  it('test path multiple data and tags', () => {
    const input:Array<{}> = [{
      val: 'val1',
      details: {id: '1', name: 'val', country:'FR'}
    },{
      val: 'val2',
      details: {id: '2', name: 'val2', country:'BE'}
    }];
    const inputFormat:FormatDescribe = {
      id:'details.id',
      name:'details.name',
      tags: ['details.country']
    };
    const res = suggest.searchForRelevant('', input, inputFormat);
    expect(res.suggest).toEqual(
      [{id: '1', name:'val', tags: [{id: "0", item: 'FR'}]}, {id: '2', name:'val2', tags: [{id:"0", item:'BE'}]}]
    );
  });

  it('test path multiple data and multiple tags', () => {
    const input:Array<{}> = [{
      val: 'val1',
      details: {id: '1', name: 'val', country:'FR', code:'S'}
    },{
      val: 'val2',
      details: {id: '2', name: 'val2', country:'BE', code:'R'}
    }];
    const inputFormat:FormatDescribe = {
      id:'details.id',
      name:'details.name',
      tags: ['details.country', 'details.code']
    };
    const res = suggest.searchForRelevant('', input, inputFormat);
    expect(res.suggest).toEqual(
      [{
        id: '1',
        name:'val',
        tags: [{id: "0", item: 'FR'}, {id: "1", item: 'S'}]
        },{
        id: '2',
        name:'val2',
        tags: [{id:"0", item:'BE'},{id: "1", item: 'R'}]}]
    );
  });
});
