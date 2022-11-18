import { response } from "express";
import fs from 'fs';
import path from 'path';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
  cloud_name: 'dubwhwd1w', 
  api_key: '932247712861198', 
  api_secret: '2xSC3WVwl1fwyB-2GNNP0lkGCd8',
  secure: true
});

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
      const nombre = await subirArchivo(req.files, undefined, '../uploads');
      
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
      return res.status(500).json({msg: 'aun no he creador esta validación, informar al backend'})
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

// controlador put que se sirve de hosting de imagenes Cloudinary
const actualizarArchivoCloudinary = async(req, res = response)=>{

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
      return res.status(500).json({msg: 'aun no he creador esta validación, informar al backend'})
  }


  // Limpiar imágenes previas (en cloudinary)
  if ( modelo.img ) {
    const nombreSplit = modelo.img.split('/');
    const nombre = nombreSplit[nombreSplit.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  //Extraer el path temporal del archivo para subirlo a cloudinary
  // console.log(req.files.archivo.tempFilePath)
  const {tempFilePath} = req.files.archivo;

  // el metodo uploader.upload retorn una promesa
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)  
  modelo.img = secure_url;
  
  await modelo.save();
  
  res.json(modelo);

};


// metodo get para mostrar/servir las imagenes subidas
const mostrarImagen = async(req, res= response)=>{

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
      return res.status(500).json({msg: 'aun no he creador esta validación, informar al backend'})
  }


  // Limpiar imágenes previas
  if ( modelo.img ) {
    // Hay que borrar la imagen del servidor reconstruyendo el path donde se aloja
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen ) ) {
        return res.sendFile(pathImagen)
    }
}

const placeHolder = path.join(__dirname, '../assets/no-image.jpg')

res.sendFile(placeHolder);

}

export{
  cargarArchivo,
  actualizarArchivo,
  mostrarImagen,
  actualizarArchivoCloudinary
}
