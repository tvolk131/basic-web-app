import initialState from '../initialState';

// TODO - Remove this action and add proper ones
export const SET_CURRENT_USER = 'global/SET_CURRENT_USER';

export default (state = initialState, {type, payload}) => {
  switch (type) {
  case SET_CURRENT_USER: 
    return {
      ...state,
      user: payload
    };
  
  default: 
    return state;
  }
};

export const setCurrentUser = payload => {
  return {
    type: SET_CURRENT_USER,
    payload
  };
};