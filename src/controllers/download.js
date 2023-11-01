const pool = require('../conexao');
const fs = require('fs');
const path = require('path');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//const senhaJwt = require('./senhaJwt');


const download = async(req,res)=>{
   // console.log("Download - ok");
    const imageDirectory =  path.join(__dirname, '../images');; // Substitua pelo caminho da pasta com as imagens

// Listar os arquivos na pasta
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



    //return res.status(200).json({message:'ok'});
}//fim



//exportacao do modulo
module.exports = {
    download
};