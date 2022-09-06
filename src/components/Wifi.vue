<script setup lang="ts">
import {add_ws_eventHandler, disconnectWifi, getWifiList, getWifiStatus, scanWifi, setConnectWifi} from "../http/api"
import {reactive, ref} from 'vue'
import {connectUrl, mqttTool, options} from "../mqttTool/mqttTool";
import {Wifi} from "../type";

// mqttTool.connect(connectUrl, options);
//
// mqttTool.on("message").then(packet=>{
//   console.log(packet)
// })
// mqttTool.publish('/vue','he')

// setWifi("gy的iPhone","12345678");

const wifiList = reactive<Wifi[]>([]);
const loading = ref(false);

async function searchWifi() {
  loading.value = true
  scanWifi();
}

add_ws_eventHandler("search", (state: string, data: { totle: number, wifi: Wifi[] }) => {
  wifiList.push(...data.wifi)
  loading.value = false
  setTimeout(() => {
    loading.value = false
  }, 9000);
})


const showModal = ref(false)
const selWifi = reactive({name: '', pwd: ''});

function connectWifi(name: string, needPwd: boolean) {
  selWifi.name = name;
  if (needPwd) {
    showModal.value = true;
  } else {
    connect();
  }
}

function connect() {
  setConnectWifi(selWifi.name, selWifi.pwd)
}

function disconnect() {
  disconnectWifi()
}


</script>

<template>
  <div class="m-bg container-fluid  d-flex justify-content-between align-content-center p-2 my-1  ">
    <div><h3>WiFi</h3></div>
    <button @click="searchWifi" class="btn btn-primary" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm"></span>
      搜索 WiFi
    </button>
  </div>
  <div class="m-wifi-list container   text-white">
    <table class="table">
      <tbody>
      <tr @click="connectWifi(item.name,item.pwd)" v-for="(item,index) in wifiList " :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.db }}</td>
        <td>{{ item.pwd }}</td>
      </tr>

      </tbody>
    </table>
  </div>

  <button @click="disconnect">disconnect</button>
  <button @click="  getWifiStatus">status</button>

  <Transition
  >
    <!-- 模态框 -->
    <div v-if="showModal" class="modal show" style="display: block">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">

          <!-- 模态框头部 -->
          <div class="modal-header">
            <h4 class="modal-title">{{ selWifi.name }}</h4>
            <button @click="showModal=false" type="button" class="btn-close"></button>
          </div>

          <!-- 模态框内容 -->
          <div class="modal-body">
            <div class="input-group mb-3">
              <span class="input-group-text">密码</span>
              <input type="text" v-model="selWifi.pwd" class="form-control" placeholder="***">
            </div>
          </div>

          <!-- 模态框底部 -->
          <div class="modal-footer">
            <p>{{ selWifi.pwd }}</p>
            <button @click="connect" type="button" class="btn btn-danger">连接</button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.m-bg {
  background: cornflowerblue;
}

.m-wifi-list {
  background: #6d8ac0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
