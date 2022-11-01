import { Router } from "express";
import { check } from "express-validator";
import { deleteCategoria, getCategoria, getCategorias, postCategoria, putCategoria } from "../controllers/categorias.js";
import { validarCategoriaPorId } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarAdminRole } from "../middlewares/validar-roles.js";

const router = Router();

// metodo para obtener todas las categorias
router.get('/', getCategorias)

// metodo para obtener una categoria
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarCategoriaPorId(id)),
    validarCampos
], getCategoria)

// crear una categoria - privado (requiere token)
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCategoria)

// actualizar una categoria - privado (requiere token)
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarCategoriaPorId(id)),
    validarCampos
], putCategoria)

// borrar categoria - solo Admin
router.delete('/:id',[
    validarJWT,
    validarAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarCategoriaPorId(id)),
    validarCampos
], deleteCategoria)

export{ router }