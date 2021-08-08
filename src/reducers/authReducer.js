import {
    SET_LOGIN_USER
} from '../constants/ActionConstants';

const initialState = {
    loginUser: {EMP_NAME:"ADMIN",EMP_ROLE:"admin"}
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOGIN_USER:
            return {
                ...state,
                loginUser: action.payload
            }
            break;       
    }
    return state;
}

export default authReducer; 