import {
    SET_PRODUCT
} from '../constants/ActionConstants';

const initialState = {
    van: []
};

function productReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PRODUCT:
            return {
                ...state,
                product: action.payload
            }
            break;       
    }
    return state;
}

export default productReducer; 