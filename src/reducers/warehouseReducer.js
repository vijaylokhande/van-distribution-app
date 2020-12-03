import {
    SET_WAREHOUSE
} from '../constants/ActionConstants';

const initialState = {
    van: []
};

function warehouseReducer(state = initialState, action) {
    switch (action.type) {
        case SET_WAREHOUSE:
            return {
                ...state,
                warehouse: action.payload
            }
            break;       
    }
    return state;
}

export default warehouseReducer; 