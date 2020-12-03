import configReducer from './configReducer';
import empReducer from './empReducer';
import vanReducer from './vanReducer';
import warehouseReducer from './warehouseReducer';
import { combineReducers} from 'redux';

const rootReducer = combineReducers(
    {
     config:configReducer,
     emp:empReducer,
     van:vanReducer,
     warehouse:warehouseReducer
    });
export default rootReducer;