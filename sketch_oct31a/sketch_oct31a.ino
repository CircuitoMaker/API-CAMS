#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include "esp_camera.h"


const char* ssid = "Maker Space";
const char* password = "mitocondria";

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WSc] Desconectado!");
      break;
    case WStype_CONNECTED:
      Serial.println("[WSc] Conectado ao servidor WebSocket");
      break;
    case WStype_TEXT:
      Serial.printf("[WSc] Recebido texto: %s\n", payload);
      break;
    case WStype_BIN:
      Serial.println("[WSc] Recebido imagem!");
      // Aqui você pode manipular a imagem recebida, se necessário.
      break;
         case WStype_PING:
        // pong will be send automatically
        Serial.printf("[WSc] get ping\n");
        break;
    case WStype_PONG:
        // answer to a ping we send
        Serial.printf("[WSc] get pong\n");
        break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(12, INPUT_PULLUP); // Botão de captura

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando à rede WiFi...");
  }
  Serial.println("Conectado à rede WiFi");
  Serial.print("Endereço IP local: ");
  Serial.println(WiFi.localIP());

  // Configure o cliente WebSocket
  webSocket.begin("192.168.1.140", 3000, "/"); // Endereço e porta do servidor Node.js
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  webSocket.enableHeartbeat(15000, 3000, 2);

  // Inicialize a câmera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = 5; // Y2_GPIO_NUM
  config.pin_d1 = 18; // Y3_GPIO_NUM
  config.pin_d2 = 19; // Y4_GPIO_NUM
  config.pin_d3 = 21; // Y5_GPIO_NUM
  config.pin_d4 = 36; // Y6_GPIO_NUM
  config.pin_d5 = 39; // Y7_GPIO_NUM
  config.pin_d6 = 34; // Y8_GPIO_NUM
  config.pin_d7 = 35; // Y9_GPIO_NUM
  config.pin_xclk = 0; // XCLK_GPIO_NUM
  config.pin_pclk = 22; // PCLK_GPIO_NUM
  config.pin_vsync = 25; // VSYNC_GPIO_NUM
  config.pin_href = 23; // HREF_GPIO_NUM
  config.pin_sscb_sda = 26; // SIOD_GPIO_NUM
  config.pin_sscb_scl = 27; // SIOC_GPIO_NUM
  config.pin_pwdn = 32; // PWDN_GPIO_NUM
  config.pin_reset = -1; // RESET_GPIO_NUM (Sem reset)
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 8;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Falha na inicialização da câmera: 0x%x", err);
    return;
  }
}


void loop() {
  webSocket.loop();

  if (digitalRead(12) == LOW) { // Botão pressionado (botão conectado ao terra)
    captureAndSendImage();
    delay(1000); // Evite envios múltiplos enquanto o botão está pressionado
  }
}// fim do loop



void captureAndSendImage() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Falha na captura da câmera");
    return;
  }

  webSocket.sendBIN(fb->buf, fb->len);
  Serial.println("Imagem enviada via WebSocket");
  esp_camera_fb_return(fb);
}// fim do loop
