export interface Wifi {
    name: string;
    db: number;
    pwd: boolean;
}


/*
wifi{
connect:true
}

*/


export interface WsData<T> {
    type: number//"eventMsg"|"msg"
    name: string//事件名,消息名
    state:string
    data: T
}