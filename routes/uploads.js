import { Router } from "express";
import { check } from "express-validator";
import cors from 'cors';

import { actualizarArchivo, actualizarArchivoCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";
import { validarColeccion } from "../helpers/db-validators.js";
import { validarArchivoSubido } from "../middlewares/validar-archivo.js";
import { validarCampos } from "../middlewares/validar-campos.js";

var whitelist = ['http://http://127.0.0.1:5173']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


const router = Router();

router.post('/',validarArchivoSubido, cargarArchivo)

router.put('/:coleccion/:id', cors(corsOptionsDelegate), [
    validarArchivoSubido,
    check('id', 'El id enviado es invalido').isMongoId(),
    check('coleccion').custom( c => validarColeccion(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarArchivo )

router.get('/:coleccion/:id', [
    check('id', 'El id enviado es invalido').isMongoId(),
    check('coleccion').custom( c => validarColeccion(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

export{router}