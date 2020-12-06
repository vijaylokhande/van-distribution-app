import configReducer from './configReducer';
import empReducer from './empReducer';
import vanReducer from './vanReducer';
import warehouseReducer from './warehouseReducer';
import productReducer from './productReducer';
import customerReducer from './customerReducer';
import { combineReducers} from 'redux';

const rootReducer = combineReducers(
    {
     config:configReducer,
     emp:empReducer,
     van:vanReducer,
     warehouse:warehouseReducer,
     product:productReducer,
     customer:customerReducer
    });
export default rootReducer;