/* eslint-disable */
import CryptoJS from "crypto-js";

const APPID = process.env.APP_ID_SPARK;
const API_SECRET = process.env.API_SECRET_SPARK;
const API_KEY = process.env.API_KEY_SPARK;

let httpUrl = new URL("https://spark-api.xf-yun.com/v3.5/chat");
let modelDomain;

let total_res = "";
function getWebsocketUrl() {
  // console.log(httpUrl.pathname)
  // 动态获取domain信息
  switch (httpUrl.pathname) {
    case "/v1.1/chat":
      modelDomain = "general";
      break;
    case "/v2.1/chat":
      modelDomain = "generalv2";
      break;
    case "/v3.1/chat":
      modelDomain = "generalv3";
      break;
    case "/v3.5/chat":
      modelDomain = "generalv3.5";
      break;
  }

  return new Promise((resolve, reject) => {
    let apiKey = API_KEY;
    let apiSecret = API_SECRET;

    let url = "wss://" + httpUrl.host + httpUrl.pathname;

    let host = location.host;
    let date = new Date().toGMTString();
    let algorithm = "hmac-sha256";
    let headers = "host date request-line";
    let signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrl.pathname} HTTP/1.1`;
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    let signature = CryptoJS.enc.Base64.stringify(signatureSha);
    let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    let authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    resolve(url);
  });
}

class TTSRecorder {
  constructor({ appId = APPID } = {}) {
    this.appId = appId;
    this.status = "init";
  }

  // 修改状态
  setStatus(status) {
    this.onWillStatusChange && this.onWillStatusChange(this.status, status);
    this.status = status;
  }

  // 连接websocket
  connectWebSocket() {
    this.setStatus("ttsing");
    return getWebsocketUrl().then((url) => {
      let ttsWS;
      if ("WebSocket" in window) {
        ttsWS = new WebSocket(url);
      } else if ("MozWebSocket" in window) {
        ttsWS = new MozWebSocket(url);
      } else {
        alert("浏览器不支持WebSocket");
        return;
      }
      this.ttsWS = ttsWS;
      ttsWS.onopen = (e) => {
        this.webSocketSend();
      };
      ttsWS.onmessage = (e) => {
        this.result(e.data);
      };
      ttsWS.onerror = (e) => {
        clearTimeout(this.playTimeout);
        this.setStatus("error");
        alert("WebSocket报错，请f12查看详情");
        console.error(`详情查看：${encodeURI(url.replace("wss:", "https:"))}`);
      };
      ttsWS.onclose = (e) => {
        console.log(e);
      };
    });
  }

  // websocket发送数据
  webSocketSend() {
    let params = {
      header: {
        app_id: this.appId,
        uid: "fd3f47e4-d",
      },
      parameter: {
        chat: {
          domain: modelDomain,
          temperature: 0.5,
          max_tokens: 1024,
        },
      },
      payload: {
        message: {
          text: [
            {
              role: "user",
              content: "中国第一个皇帝是谁？",
            },
            {
              role: "assistant",
              content: "秦始皇",
            },
            {
              role: "user",
              content: "秦始皇修的长城吗",
            },
            {
              role: "assistant",
              content: "是的",
            },
            {
              role: "user",
              content: $("#input_text").text(),
            },
          ],
        },
      },
    };
    console.log(JSON.stringify(params));
    this.ttsWS.send(JSON.stringify(params));
  }

  start() {
    total_res = ""; // 请空回答历史
    this.connectWebSocket();
  }

  // websocket接收数据的处理
  result(resultData) {
    let jsonData = JSON.parse(resultData);
    total_res = total_res + resultData;
    $("#output_text").val(total_res);
    // console.log(resultData)
    // 提问失败
    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`);
      console.error(`${jsonData.header.code}:${jsonData.header.message}`);
      return;
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      this.ttsWS.close();
      bigModel.setStatus("init");
    }
  }
}

let bigModel = new TTSRecorder();
bigModel.onWillStatusChange = function (oldStatus, status) {};
