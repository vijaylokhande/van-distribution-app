import {
    SET_APP_CONFIGURATION,
    ADD_NEW_APP_CONFIGURATION,
    IN_PROGRESS
} from '../constants/ActionConstants';

const initialState = {
    configuration: [],
    inProgress: false
};

function configReducer(state = initialState, action) {
    switch (action.type) {
        case SET_APP_CONFIGURATION:
            return {
                ...state,
                configuration: action.payload
            }
            break;
        
        case IN_PROGRESS:
            return {
                ...state,
                inProgress: action.payload
            }
            break;
    }
    return state;
}

export default configReducer; 