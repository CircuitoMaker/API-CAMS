const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 3000; // Porta do servidor

app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (página HTML)

const startWebSocketServer = require('./serverSocket');
startWebSocketServer(server); // Inicialize o servidor WebSocket passando o servidor HTTP

//app.use(express.json())
const rotas = require('./rotas')

app.use(rotas);


server.listen(process.env.PORT || 3000, () => {
   console.log(`Servidor WebSocket em execução na porta ${PORT}`);
})





// app.get('/foto/:id?/:flash?', (req, res) => {
//   console.log("Rota '/foto' acessada.");

//   let {id,flash} = req.params;

//   if(!flash){
//     flash = 0;
//     }
    
//   console.log("flash = " + flash);
// //console.log("Nova camera conectada ID = " + id);


//   // Envia a string id para todos os cliente WebSocket
//   esp32CamSockets.forEach(ws => {
//     ws.send(id + '-' + flash);
//   });

//   res.sendStatus(200);
// });



// // Manipulador para receber conexões WebSocket das ESP32-CAMs
// wss.on('connection', (ws,req) => {

//   const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
//   const cameraId = parsedUrl.searchParams.get('id');

//  //console.log(cameraId);
//  console.log("Nova camera conectada ID = " + cameraId);


//   esp32CamSockets.add(ws);

//   ws.on('message', (message) => {
//     if (message instanceof Buffer) {
//       console.log('Recebida imagem da ESP32-CAM');
//       // Salve a imagem em um arquivo no servidor
//       //const imagePath = path.join(__dirname, 'images', `Foto_CAM_ID_${cameraId}_${Date.now()}.jpg`);
      
//       const { format } = require('date-fns');
//       //const timestamp = format(new Date(), 'yyyyMMddHHmmss'); // Formate a data atual no formato desejado
//       const timestamp = format(new Date(), 'dd-MM-yyyy-HH_mm_ss'); // Formate a data atual no formato desejado
//       const imagePath = path.join(__dirname,'images',`CAM_ID_${cameraId}_${timestamp}.jpg`); // Nome do arquivo com o ID da câmera e data formatada
    
      
//       fs.writeFile(imagePath, message, (err) => {
//         if (!err) {
//           console.log('Imagem salva em', imagePath);
//         } else {
//           console.error('Erro ao salvar a imagem:', err);
//         }
//       });
//     }
//   });

//   ws.on('close', () => {
//     esp32CamSockets.delete(ws);
//   });
// });

// server.listen(process.env.PORT || 3000, () => {
//   console.log(`Servidor WebSocket em execução na porta ${PORT}`);
// });



