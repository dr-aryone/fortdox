module.exports = {
  showSearchField,
  search,
  searchFieldChange
};

function showSearchField() {
  return (dispatch, getState) => {
    let state = getState();
    if (!(state.navigation.get('currentView') === 'USER_VIEW' || state.navigation.get('currentView') === 'SEARCH_VIEW') || !state.updateDocument.get('documentToUpdate')) {
      return;
    }

    dispatch({
      type: 'SHOW_SEARCH_FIELD'
    });
  };
}

function searchFieldChange(value) {
  return {
    type: 'SEARCH_FIELD_CHANGE',
    payload: {
      value
    }
  };
}

function search() {
  return (dispatch, getState) => {
    let state = getState();
    let searchFieldValue = state.updateDocument.getIn(['searchField', 'value']);
    window.find(searchFieldValue);
  };
}
