import http from "./http";
import {Wifi, WsData} from "../type";
import {createLogger} from "vite";

/*
ws data
export interface WsData{
    type: number//"eventMsg"|"msg"
    name: string//事件名,消息名
    state:string
    data: any
}

*/
export type wsCallbackF = <T>(state: string, data: any) => void

const eventHandlerList = new Map<string, wsCallbackF>()


export const ws = new WebSocket("ws://10.20.161.210:8080/ws");
ws.onmessage = (ev) => {
    const wsdata: WsData<any> = JSON.parse(ev.data)
    if (wsdata.type == 0) {
        const fn: wsCallbackF = eventHandlerList.get(wsdata.name) as wsCallbackF
        wsdata.data = JSON.parse(wsdata.data.toString())
        fn(wsdata.state, wsdata.data);
    }
    console.log('wsdata',wsdata)
}

export function add_ws_eventHandler(name: string, fn: wsCallbackF) {
    eventHandlerList.set(name, fn)
}


export function scanWifi() {
    ws.send("scanWifi");
}

export function disconnectWifi() {
    ws.send("disconnectWifi");
}

export function getWifiList() {
    return http.get<{ totle: number, wifi: Wifi[] }>("/wifi/list").then(list => {
        console.log(list)
        return list;
    })
}

export function setConnectWifi(name: string, pwd: string) {
    return http.get("/wifi/connect?ssid="+name+"&pwd="+pwd).then(res => {
        console.log(res)
    })
}

export function getWifiStatus() {
    return http.get('/wifi/status').then(res => {
        console.log(res)
    })
}