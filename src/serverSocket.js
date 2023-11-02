const WebSocket = require('ws');
const esp32CamSockets = require('./esp32CamSocketsModule');
const path = require('path');
const fs = require('fs');

module.exports = (server) => {

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Lógica de conexão WebSocket, manipuladores de mensagens, etc.

      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const cameraId = parsedUrl.searchParams.get('id');
    
     console.log(cameraId);
     console.log("Nova camera conectada ID = " + cameraId);
    
     esp32CamSockets.add(ws);

     ws.on('message', (message) => {

    if (message instanceof Buffer) {
      console.log('Recebida imagem da ESP32-CAM');
      
      const imageDirectory = path.join(__dirname, 'images'); // Diretório onde as imagens serão salvas

      // Verifique se o diretório existe, e crie-o se não existir
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }


      const { format } = require('date-fns');
      // Salve a imagem em um arquivo no servidor
      const timestamp = format(new Date(), 'dd-MM-yyyy-HH_mm_ss'); // Formate a data atual no formato desejado
      const imagePath = path.join(__dirname,'images',`CAM_ID_${cameraId}_${timestamp}.jpg`); // Nome do arquivo com o ID da câmera e data formatada
      console.log(imagePath);
      
      fs.writeFile(imagePath, message, (err) => {
        if (!err) {
          console.log('Imagem salva em', imagePath);
        } else {
          console.error('Erro ao salvar a imagem:', err);
        }
      });
    }
  });
        


    ws.on('close', () => {
      esp32CamSockets.delete(ws);
    });
  });
};
