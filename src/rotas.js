const express = require("express");
const rotas = express();
//const verificarUsuarioLogado = require("./middlewares/autenticacao");
const pool = require("./conexao");

const download = require("./controllers/download");
const foto = require("./controllers/foto");
//const esp32CamSockets = new Set();

//rotas sem login
rotas.get("/foto/:id?/:flash?", foto.captura);
rotas.get("/download", download.download);
rotas.get("/fotos", foto.buscaUltima);

module.exports = rotas;