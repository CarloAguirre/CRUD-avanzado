import { Router } from "express";
import { check } from "express-validator";
import { deleteProducto, getProducto, getProductos, postProducto, putProducto } from "../controllers/productos.js";
import { validarProductoPorId } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol, validarAdminRole } from "../middlewares/validar-roles.js";

const productos = Router()

// metodo para obtener todas los productos
productos.get('/', getProductos)

// metodo para obtener un producto
productos.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarProductoPorId(id)),
    validarCampos
], getProducto)

// crear un producto - privado (requiere token)
productos.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'Por favor asigna un nuevo precio').not().isEmpty(),
    check('precio', 'El precio debe ser numerico').isNumeric(),
    check('categoria', 'Por favor selecciona una categoria').not().isEmpty(),
    validarCampos
], postProducto)

// actualizar un producto - privado (requiere token)
productos.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'Por favor asigna un nuevo precio').not().isEmpty(),
    check('precio', 'El precio debe ser numerico').isNumeric(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarProductoPorId(id)),
    validarCampos
], putProducto)

// borrar producto - Usuarios
productos.delete('/:id',[
    validarJWT,
    tieneRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(id => validarProductoPorId(id)),
    validarCampos
], deleteProducto)

export{productos}