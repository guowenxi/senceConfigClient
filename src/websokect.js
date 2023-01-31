import { useEventEmitter } from 'ahooks';
import { io } from "socket.io-client";
import {  message } from 'antd';
import {  wsUrl } from './http';
export const socket =  new WebSocket(wsUrl);
export let socketList =[];
socket.onopen = (e) => {
    subscription.state = true ;
    console.log(`sokect link was connecting`);
};
socket.onmessage = (e) => {
    const list =JSON.parse(e.data);
    // let sendList = [];
    if(list){
        //暂时判断点位 不涉及设备
        // for(var i = 0 ; i <list.pointData.length ; i++){
        //     for(var n = 0 ;n <subscription.socketList.length ; n++){
        //         if(list.pointData[i].id == subscription.socketList[i].pointId){
        //             sendList.push({
        //                 domId:subscription.socketList[i].domId,
        //                 pointId:subscription.socketList[i].pointId,
        //                 value:list.pointData[i].value
        //             })
        //             continue;
        //         }
        //     }
        // }
    }
    subscription.event$.emit(list.pointData)
};

socket.onerror = (e)=>{
    message.open({
        type: 'error',
        content: 'ws连接错误',
      });
}
socket.onclose =(e) => {
    message.open({
        type: 'warning',
        content: 'ws连接关闭',
      });
};
export const subscription ={
    sendData:{"pointIds":null, "moduleIds":null,type:'getModuleAndPoint'},
    state:false,
    socketList:[],
    event$:null,
    save:function(list,event$){
        this.socketList = list;
        this.event$ = event$;
        this.emit();
    },
    remove:function(){
        this.socketList = [];
        this.emit();
    },
    emit:function(){
        let ids = [];
        this.socketList.map((item)=>{
            ids.push(item.pointId)
        })
        this.sendData['pointIds'] = ids;
        setTimeout(()=>{
            socket.send(JSON.stringify(this.sendData));
        },500)
    },
}
