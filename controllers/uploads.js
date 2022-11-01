import { response } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { subirArchivo } from "../helpers/uploader-files.js";
import { Producto } from "../models/producto.js";
import { Usuario } from "../models/usuario.js";


//controlador de metodo get
const cargarArchivo = async(req, res = response)=>{
  
    //ejecutamos la subida del archivo dentro de un try para maneja errores (formatos de archivos no permitidos)
    try {
      
      //enviamos el segundo argumento como undefined ya que es necesario enviar el segundo argumento para enviar tambien el tercero
      const nombre = await subirArchivo(req.files, undefined, 'imgs');
      
      res.json({
        nombre: nombre
      })
    } catch (msg) {
      res.status(400).json({msg})
    }
};

//controlador de metodo put para actualizar imagenes de usuarios y productos
const actualizarArchivo = async(req, res = response)=>{

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `No existe el usuario con id ${id}`
        })
      }  

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `No existe el producto con id ${id}`
        })
      } 
    
    break; 
    default:
      return res.status(500).json({msg: 'aun no he creador esta coleccion'})
  }


  // Limpiar imágenes previas
  if ( modelo.img ) {
    // Hay que borrar la imagen del servidor reconstruyendo el path donde se aloja
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen ) ) {
        fs.unlinkSync( pathImagen );
    }
}

  
  const nombre = await subirArchivo(req.files, undefined, coleccion);
  //Guardamos la imagen en la 'opcion' img de los modeles Usuario y/o Producto
  modelo.img = nombre;
  
  await modelo.save();
  
  res.json(modelo);

};

export{
  cargarArchivo,
  actualizarArchivo
}
