import { response } from "express";
import { isValidObjectId } from "mongoose";
import { Usuario } from "../models/usuario.js";
import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";

const coleccionesValidas =[
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


//metodo para buscar usuarios de tipo '/buscar/usuarios/termino' 
const buscarUsuarios = async(termino = '', res = response)=>{

    //enviaremos en id del usuario como termino de la coleccion 'usuarios'
    const esMongoID = isValidObjectId(termino) // retorna 'true'

    if(esMongoID){
        const usuario = await Usuario.findById(termino)

        return res.status(200).json({
            results: (usuario) ? [usuario] : []
        })
    };

    //Haremos que la bsuqueda sea flexible para buscar usuarios por nombre o correo
    
    //primero igualaremos el 'termino' a una expresion regular key sensitive
    const regex = new RegExp(termino, 'i');
    
    const usuarios = await Usuario.find({
        //Mongo nos permite utilizar expresion como $or y $and para los criterios de busqueda
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });
    
    res.json({
        results: usuarios
    })
}


//metodo para buscar categorias de tipo '/buscar/categoria/termino' 
const buscarCategorias = async(termino = '', res = response)=>{
    const esMongoID = isValidObjectId(termino)

    if(esMongoID){
        const categoria = await Categoria.findById(termino);

        return res.status(200).json({
            results: (categoria) ? [categoria] : []
        })
    };

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias
    })
 
};


//metodo para buscar productos de tipo '/buscar/productos/termino'
const buscarProductos = async(termino = '', res = response)=>{
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre') //Hacemos populate para trar el nombre de la categoria tambien

        return res.status(200).json({
            results: (producto) ? [producto] : []
        })
    };

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre: regex, estado: true})
                            .populate('categoria', 'nombre')

    res.status(200).json({
        results: productos
    })
}



const getBusqueda = (req, res = response)=>{
    
    const {coleccion, termino} = req.params;
    
    if(!coleccionesValidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesValidas}`
        })
    }

    switch (coleccion) {
 
        case 'usuarios':
            buscarUsuarios(termino, res)

            break;     
        case 'categorias':
            buscarCategorias(termino, res)

            break;
        case 'productos':
            buscarProductos(termino, res)

            break;
        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'Este busqueda aun no ha sido desarrollado'
            })
    }
};

export{
    getBusqueda
}