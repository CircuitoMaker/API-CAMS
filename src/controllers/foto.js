const pool = require('../conexao');
const fs = require('fs');
const path = require('path');

const esp32CamSockets = require('../esp32CamSocketsModule');
const serverSocket = require('../serverSocket');

const captura = async(req,res)=>{
    //console.log("Captura foto - ok");
 
    console.log("Rota '/CapturaFoto' acessada.");

      let {id,flash} = req.params;
    
      if(!flash){
        flash = 0;
        }
        
      console.log("flash = " + flash);
      console.log("Nova camera conectada ID = " + id);
    
      // Envia a string id para todos os cliente WebSocket
      esp32CamSockets.forEach(ws => {
        ws.send(id + '-' + flash);
      });
    
      res.sendStatus(200);
}//fim



const buscaUltima = async(req,res)=>{
    //console.log("Busca Ultima - ok");

 const imageDirectory = path.resolve(__dirname, '../images');
 console.log(imageDirectory);

  fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao listar os arquivos da pasta.');
    }

    // Encontre o arquivo mais recente
    const latestFile = files.reduce((latest, file) => {
      const currentFile = fs.statSync(`${imageDirectory}/${file}`);
      if (!latest || currentFile.mtime > latest.mtime) {
        return { file, mtime: currentFile.mtime };
      }
      return latest;
    }, null);

    if (!latestFile) {
      return res.status(404).send('Nenhum arquivo encontrado na pasta.');
    }

    // Crie o caminho completo do arquivo
    const filePath = `${imageDirectory}/${latestFile.file}`;

    // Configure o cabeçalho para forçar o download do arquivo
    res.setHeader('Content-Disposition', `attachment; filename="${latestFile.file}"`);
    res.setHeader('Content-Type', 'image/jpeg');

    // Envie o arquivo para o cliente
    res.sendFile(filePath);
  });

}//fim



//exportacao do modulo
module.exports = {
    captura,
    buscaUltima
};