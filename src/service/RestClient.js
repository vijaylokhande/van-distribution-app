
import axios from 'axios';
import {HOST} from '../constants/AppConstants';

    export const getCall = url =>{
         return axios.get(HOST.concat(url));
     }

     export const postCall =(url,data)=>{
        return axios.post(HOST.concat(url),data);
    }

    export const putCall =(url,data)=>{
        return axios.put(HOST.concat(url),data);
    }

    export const deleteCall =url=>{
        return axios.delete(HOST.concat(url));
    }

    

