import http from "./http";
import {Wifi} from "../type";
import {h} from "vue";

export const ws = new WebSocket("ws://192.168.4.1:8080/ws");
ws.onmessage=(ev)=>{
    console.log(ev.data)
}

export function scanWifi(){
    ws.send("scanWifi");
}
export function disconnectWifi(){
    ws.send("disconnectWifi");
}

export function getWifiList() {
    return http.get<{totle:number,wifi:Wifi[]}>("/wifi/list").then(list => {
        console.log(list)
       return list;
    })
}

export function setConnectWifi(name: string, pwd: string) {
    return http.post("/wifi/connect", {name, pwd}).then(res => {
        console.log(res)
    })
}
export function getWifiStatus(){
    return http.get('/wifi/status').then(res=>{
        console.log(res)
    })
}