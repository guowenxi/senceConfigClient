import axios from 'axios';
export const root = "http://192.168.1.244";
export const wsUrl = "ws://192.168.1.244:15420/ws/socket";
export const baseUrl = `${root}:30000`;
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export const http = function(conf){
    const {
        method,
        url,
        data,
      }  = conf;
      const config = {
        method:method || 'get',
        url:url || '',
        [method.toUpperCase() === 'POST' ? 'data' : 'params']:data || {},
    };
    if(method.toUpperCase() === 'POST'){
        // config.contentType = 'application/x-www-form-urlencoded';
        // config['headers'] = {
        //     'Content-Type' : 'application/x-www-form-urlencoded'
        // }
    }
    return axios(config)
}


export const rbacToken = "test";
export const sendValueUrl = "http://192.168.1.244:8001/data_collect/point/issuedPoint";
export const getTreeDeviceGroupList = "http://192.168.1.244:30002/enginConfigure/devicegroupManger/getTreeDeviceGroupList";