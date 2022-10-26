import { response } from "express";
import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";

// metodo para obtener todas las productos - populate
const getProductos = async(req, res = response)=>{

    const {limite = 5, desde = 0} = req.query

    const [productos, total] = await Promise.all([
        Producto.find({estado:true})
            .limit(limite)
            .skip(desde)
            // populate() es una funcion de mongoose que permite extraer propiedades de metodos/schemas "prestados"
            .populate('usuario', 'nombre'),
        Producto.countDocuments({estado:true})    
    ])

    res.json({
        total,
        productos
    })
};

// Metodo para obtener un producto - populate
const getProducto = async(req, res = response)=>{

    const {id} = req.params
    
    const producto = await Producto.findById(id)
                                     .populate('usuario', 'nombre');

    res.json({
        producto
    })
};

// crear un producto - privado (requiere token)
const postProducto = async(req, res = response)=>{

    const {nombre, precio, categoria} = req.body

    //generar la data que se guardara
    const data = {
        nombre,
        precio,
        categoria,
        usuario: req.usuario._id,
    }

    const existeCategoria = await Categoria.findOne({categoria})

    //TODO: VINCULAR EL ID DE LA CATEGORIA A LA DATA DEL PRODUCTO

    if(!existeCategoria){
        return res.json({
            msg: 'Por favor selecciona una categoria existente'
        })
    }

    //crear el producto con la data
    const producto = new Producto(data)
    
    // guardar la producto en la BD

    await producto.save();

    res.status(201).json(producto) //<-- estatus 201 = creado            
};

// actualizar un producto - privado (requiere token)
const putProducto = async(req, res = response)=>{
    const {id} = req.params
    const {estado, usuario, ...data} = req.body;
    
    data.usuario = req.usuario._id;

    const productoUpdate = await Producto.findByIdAndUpdate(id, data, {new: true}) 

    res.status(200).json({
        productoUpdate
    })
};

// borrar producto 
const deleteProducto = async(req, res = response)=>{

    const {id} = req.params;

    const borrarProducto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.status(200).json({
        borrarProducto
    })
};


export{
    getProductos, 
    getProducto,
    postProducto, 
    putProducto, 
    deleteProducto
}
