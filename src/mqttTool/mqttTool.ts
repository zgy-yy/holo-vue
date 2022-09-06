// @ts-ignore
import * as mqtt from "mqtt/dist/mqtt.js"
import {MqttClient} from "mqtt";

interface Opt {
    clean: boolean, // true: 清除会话, false: 保留会话
    connectTimeout: number, // 超时时间
    // 认证信息
    clientId: string,
    username: string,
    password: string
}

type Qos = 0 | 1 | 2

interface Packet {
    cmd: string
    dup: boolean
    length: number
    payload: Uint8Array
    qos: number
    retain: boolean
    topic: string,
    msg:string
}

type MqttEvent = 'connect' | 'reconnect' | 'close' | 'disconnect' | 'offline' | 'error' | 'message'

export const connectUrl = 'ws://zgy.ink:8083/mqtt'


export const options = {
    clientId: 'zgy-yy-holo-cubic',
    username: 'vue-client',
    password: '',
    clean: false,
    connectTimeout: 600000
}

interface MqttTool {
    client: MqttClient | null
    connect: (url: string, opts: Opt) => void
    end: () => Promise<any>
    reconnect: () => Promise<any>
    subscribe: (topic: string, qos: Qos) => Promise<any>
    unsubscribe: (topic: string) => Promise<any>
    publish: (topic: string, msg: string) => Promise<any>
    on: (event: MqttEvent) => Promise<Packet>
}


export const mqttTool: MqttTool = {
    client: null,
    connect: function (connectUrl, options) {
        mqttTool.client = mqtt.connect(connectUrl, options)
    },
    end: function () {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve('未连接')
                console.log('App_text' + ":end 未连接")
                return;
            }
            mqttTool.client.end()
            mqttTool.client = null
            resolve('连接终止')
        })
    },
    reconnect: function () {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve('未连接')
                console.log('App_text' + ":reconnect 未连接")
                return;
            }
            mqttTool.client.reconnect()
        })
    },
    subscribe: function ( topic: string, qos: Qos) {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve('未连接')
                console.log('App_text' + ":unconnect 未连接")
                return;
            }
            mqttTool.client.subscribe(topic, {qos: qos}, function (err, res) {
                // console.log(err, res)
                if (!err && res.length > 0) {
                    resolve('订阅成功')
                    console.log('App_text' + ":subscribe  success 订阅成功" + '==="' + topic + '"')
                } else {
                    resolve('订阅失败')
                    console.log('App_text' + ":subscribe failed 订阅失败")
                    return;
                }
            })
        })
    },
    unsubscribe: function (topic: string) {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve('未连接')
                console.log('App_text' + ":unconnect 未连接")
                return;
            }
            mqttTool.client.unsubscribe(topic, function (err: any) {
                if (!err) {
                    resolve('取消订阅成功')
                    console.log('App_text' + ":unsubscribe success 取消订阅成功")
                } else {
                    resolve('取消订阅失败')
                    console.log('App_text' + ":unsubscribe failed 取消订阅失败")
                    return;
                }
            })
        })
    },
    publish: function ( topic: string, message: string ) {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve('未连接')
                console.log('App_text' + ":unconnect 未连接")
                return;
            }
            mqttTool.client.publish(topic, message, function (err) {
                if (!err) {
                    resolve(topic + '-' + message + '-发送成功')
                    console.log('App_text' + ":publish success 发送成功")
                } else {
                    resolve(topic + '-' + message + '-发送失败')
                    console.log('App_text' + ":publish failed 发送失败")
                    return;
                }
            })
        })
    },
    on: function (event) {
        return new Promise((resolve, reject) => {
            if (mqttTool.client == null) {
                resolve({
                    cmd: 'error',
                    dup: false,
                    length: 0,
                    payload: new Uint8Array(),
                    qos: -1,
                    retain: false,
                    topic: '',
                    msg:''
                })
                console.log('App_text' + ":unconnect 未连接")
                return;
            }
            mqttTool.client.on(event, function (topic: string, payload: Uint8Array, packet: Packet) {
                if (packet) {
                    packet.msg=''
                    for (let i = 0; i < packet.payload.length; i++) {
                        packet.msg += String.fromCharCode(packet.payload[i]);
                    }
                    resolve(packet)
                }
            })
        })
    }
}
