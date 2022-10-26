import { response } from "express";
import { Categoria } from "../models/categoria.js";
import { Usuario } from "../models/usuario.js";

// metodo para obtener todas las categorias + populate
const getCategorias = async(req, res = response)=>{

    const {limite = 5, desde = 0} = req.query

    // const categorias = await Categoria.find({estado: true})
    //     .limit(limite)
    //     .skip(desde)

    // const total = await Categoria.countDocuments({estado: true})

    const [categorias, total] = await Promise.all([
        Categoria.find({estado:true})
            .limit(limite)
            .skip(desde)
            // populate() es una funcion de mongoose que permite extraer propiedades de metodos/schemas "prestados"
            .populate('usuario', 'nombre'),
        Categoria.countDocuments({estado:true})    
    ])

    res.json({
        total,
        categorias
    })
};

// Metodo para obtener una categoria - populate
const getCategoria = async(req, res = response)=>{

    const {id} = req.params
    
    const categoria = await Categoria.findById(id)
                                     .populate('usuario', 'nombre');

    // const usuarioID = categoria.usuario
 
    // const usuario = await Usuario.findById(usuarioID)
    res.json({
        categoria
    })
};

// crear una categoria - privado (requiere token)
const postCategoria = async(req, res = response)=>{

    // const{nombre} = req.body
    //Lo guardaremos todo en mayuscula para que no se puedan crear 2 categorias iguales.
    const nombre = req.body.nombre.toUpperCase()

    //Verificaremos si la categoria ya existe
    const categoriaDB = await Categoria.findOne({nombre}) 

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    //generar la data que se guardara
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //crear la categoria con la data
    const categoria = new Categoria(data)
    
    // guardar la categoria en la BD

    await categoria.save();

    res.status(201).json(categoria) //<-- estatus 201 = creado            
};

// actualizar una categoria - privado (requiere token)
const putCategoria = async(req, res = response)=>{
    const {id} = req.params
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaUpdate = await Categoria.findByIdAndUpdate(id, data, {new: true}) 

    res.status(200).json({
        categoriaUpdate
    })
};

// borrar categoria - solo Admin
const deleteCategoria = async(req, res = response)=>{

    const {id} = req.params;

    const borrarCategoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.status(200).json({
        borrarCategoria
    })
};


export{
    getCategorias, 
    getCategoria, 
    postCategoria, 
    putCategoria, 
    deleteCategoria
}

