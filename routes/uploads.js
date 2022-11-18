import { Router } from "express";
import { check } from "express-validator";

import { actualizarArchivo, actualizarArchivoCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";
import { validarColeccion } from "../helpers/db-validators.js";
import { validarArchivoSubido } from "../middlewares/validar-archivo.js";
import { validarCampos } from "../middlewares/validar-campos.js";


const router = Router();

router.post('/',validarArchivoSubido, cargarArchivo)

router.put('/:coleccion/:id', [
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