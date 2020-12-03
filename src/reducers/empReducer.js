import {
    SET_EMPLOYEE
} from '../constants/ActionConstants';

const initialState = {
    employee: []
};

function empReducer(state = initialState, action) {
    switch (action.type) {
        case SET_EMPLOYEE:
            return {
                ...state,
                employee: action.payload
            }
            break;       
    }
    return state;
}

export default empReducer; 