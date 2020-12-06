import {
    SET_CUSTOMER
} from '../constants/ActionConstants';

const initialState = {
    van: []
};

function customerReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CUSTOMER:
            return {
                ...state,
                customer: action.payload
            }
            break;       
    }
    return state;
}

export default customerReducer; 