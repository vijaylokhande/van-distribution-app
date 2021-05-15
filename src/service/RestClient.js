
import axios from 'axios';
import {HOST} from '../constants/AppConstants';
 
    
    

    export const getCall = (url,token) =>{
        const header={
            headers:{
                Authorization : 'Bearer '.concat(token)
            }
        };
        return header ? axios.get(HOST.concat(url),header): axios.get(HOST.concat(url));
     }

    export const postCall =(url,data,token)=>{  
        const header={
            headers:{
                Authorization : 'Bearer '.concat(token)
            }
        };      
        return header ? axios.post(HOST.concat(url),data,header):axios.post(HOST.concat(url),data);
    }

    export const putCall =(url,data,token)=>{
        const header={
            headers:{
                Authorization : 'Bearer '.concat(token)
            }
        };
        return header ? axios.put(HOST.concat(url),data,header):axios.put(HOST.concat(url),data);
    }

    export const deleteCall =(url,token)=>{
        const header={
            headers:{
                Authorization : 'Bearer '.concat(token)
            }
        };
        return header ? axios.delete(HOST.concat(url),header): axios.delete(HOST.concat(url));
    }

    

