import { useEventEmitter } from 'ahooks';
import { io } from "socket.io-client";
const wsUrl = "ws://192.168.1.229:15420/ws/socket";
export const socket = io(wsUrl);
export let socketList =[];
socket.on("connect", () => {
    debugger
    console.log(`sokect link was connecting`);
});
socket.on("disconnect", () => {
    console.log(`sokect link was disconnect`);
});
socket.on("close", (reason) => {
    console.log(reason);
});

export const subscription ={
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
    emit:function(list){
        let ids = [];
        this.socketList.map((item)=>{
            ids.push(item.pointId)
        })
        debugger
        socket.emit("socket",{status: 2, ids: ids});
    },
    on:()=>{
        socket.on("socket",msg=>{
            debugger
        });
    }
}
subscription.on();
