import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";
import { Role } from "../models/role.js";
import { Usuario } from "../models/usuario.js";

const validarRol = async (rol = '')=>{
    const existeRol = await Role.findOne({ rol });

    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la Base de Datos.`)
    }
};

//verificamos el correo (con await ya que es una consulta a la base de datos)
const validarCorreo = async(correo)=>{
    const mailExiste  = await Usuario.findOne({correo: correo});
    if(mailExiste){
        throw new Error(`El mail ${correo} ya esta registrado, intenta con otro`)  
    };
}


//verificamos el id de usuarios
const validarUsuarioPorId = async(id)=>{
    const existeId  = await Usuario.findById(id);
    if(!existeId){
        throw new Error(`No hay ningun usuario registrado con el id: ${id}`)  
    };
}

//verificamos el id de categorias
const validarCategoriaPorId = async(id)=>{
    const existeId  = await Categoria.findById(id);
    if(!existeId){
        throw new Error(`No hay ninguna categoria con el id: ${id}`)  
    };
}

//verificamos el id de productos
const validarProductoPorId = async(id)=>{
    const existeId  = await Producto.findById(id);
    if(!existeId){
        throw new Error(`No hay ningun producto con el id: ${id}`)  
    };
}

//verificamos el id de la categoria enviada
const validarProductosPorCategoria = async(id)=>{
    const existeCategoria  = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`No hay ninguna categoria con el id: ${id}`)  
    };
}



//Verificamos si la coleccion enviada en uploads (put) es valida
const validarColeccion = (coleccion = '', colecciones = [])=>{
    const coleccionPermitida = colecciones.includes(coleccion);
    if(!coleccionPermitida){
        throw new Error (`La coleccion ${coleccion} no existe. Colecciones permitidas: ${colecciones}`)
    }
    //El los validadores anteriores el 'return true' esta implicito en el await.
    return true;
}
    


export{
    validarRol, 
    validarCorreo, 
    validarUsuarioPorId, 
    validarCategoriaPorId,
    validarProductoPorId,
    validarColeccion,
    validarProductosPorCategoria
};