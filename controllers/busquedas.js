import { response } from "express";
import { isValidObjectId } from "mongoose";
import { Usuario } from "../models/usuario.js";

const coleccionesValidas =[
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response)=>{

    //enviaremos en id del usuario como termino de la coleccion 'usuarios'
    const esMongoID = isValidObjectId(termino) // retorna 'true'

    if(esMongoID){
        const usuario = await Usuario.findById(termino)

        res.status(200).json({
            results: (usuario) ? [usuario] : []
        })
    };

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

            break;
        case 'productos':

            break;
        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'Este busqueda aun no ha sido desarrollado'
            })
    }


    // res.json({
    //     coleccion,
    //     termino
    // });

};

export{
    getBusqueda
}