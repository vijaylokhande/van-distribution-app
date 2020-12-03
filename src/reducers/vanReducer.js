import {
    SET_VAN
} from '../constants/ActionConstants';

const initialState = {
    van: []
};

function vanReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VAN:
            return {
                ...state,
                van: action.payload
            }
            break;       
    }
    return state;
}

export default vanReducer; 