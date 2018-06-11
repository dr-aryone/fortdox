const requestor = require('@edgeguideab/client-request');
const config = require('config.json');
const { getPrefix } = require('./utilities');

const addTag = tag => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let tagList = state[view].getIn(['docFields', 'tags', 'list']);
    if (tag === undefined)
      tag = state[view].getIn(['docFields', 'tags', 'value']);
    if (tag.trim() === '') return;
    if (tagList.contains(tag))
      return dispatch({
        type: `${prefix}_ADD_TAG_FAIL`,
        payload: `${tag} has already been added.`
      });
    tagList = tagList.push(tag.toLowerCase());
    return dispatch({
      type: `${prefix}_ADD_TAG`,
      payload: tagList
    });
  };
};

const removeTag = tagIndex => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let tagList = state[view].getIn(['docFields', 'tags', 'list']);
    tagList = tagList.splice(tagIndex, 1);
    return dispatch({
      type: `${prefix}_REMOVE_TAG`,
      payload: tagList
    });
  };
};

const getOldTags = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let { prefix } = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_GET_OLD_TAGS_START`
    });
    let organization = state.user.get('organization');
    let response;
    try {
      response = await requestor.get(`${config.server}/tags`, {
        query: {
          organization
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
        case 408:
        case 500:
          return dispatch({
            type: `${prefix}_GET_OLD_TAGS_ERROR`,
            payload: 'Unable to get old tag list.'
          });
      }
    }
    let tagList = [];
    response.body.forEach(tag => tagList.push(tag.key));
    return dispatch({
      type: `${prefix}_GET_OLD_TAGS_SUCCESS`,
      payload: tagList.sort()
    });
  };
};

const suggestTags = inputValue => {
  return (dispatch, getState) => {
    if (inputValue.slice(-1) === ' ') return dispatch(addTag());
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let oldTags = state[view].getIn(['docFields', 'tags', 'old']);
    let suggestedTags = [];
    oldTags.some(tag => {
      if (tag.startsWith(inputValue)) suggestedTags.push(tag);
      if (suggestedTags.length === 5) return;
    });
    return dispatch({
      type: `${prefix}_INPUT_CHANGE_TAGS`,
      value: inputValue,
      suggestedTags
    });
  };
};

const setTagIndex = index => {
  return dispatch => {
    return dispatch({
      type: 'CREATE_DOCUMENT_SET_TAG_INDEX',
      payload: index
    });
  };
};

export default {
  addTag,
  removeTag,
  getOldTags,
  suggestTags,
  setTagIndex
};
