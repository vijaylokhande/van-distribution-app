
import {SET_APP_CONFIGURATION,SET_EMPLOYEE} from '../constants/ActionConstants';

export function setAppConfiguration(data) {
    return { type: SET_APP_CONFIGURATION, data }
};

export function setEmployee(data) {
    return { type: SET_EMPLOYEE, data }
};