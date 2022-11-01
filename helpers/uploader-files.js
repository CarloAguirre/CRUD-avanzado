import { v4 as uuidv4 } from 'uuid';
// path nos permite generar las rutas como se ve en el codigo
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const subirArchivo = (files, extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta= '')=>{

    return new Promise((resolve, reject)=>{
        
        const { archivo } = files;

        // validar la extension del archivo
        const nombreSplit = archivo.name.split('.')
        const extension = nombreSplit[nombreSplit.length-1]

        if(!extensionesValidas.includes(extension)){
            return reject(`Los formatos de archivo permitidos son: ${extensionesValidas}`)
        }

        //crear nombre temporal (id)
        const idName = uuidv4() + '.' + extension; 
        
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, idName);
    
        archivo.mv(uploadPath, (err)=> {
        if (err) {
            reject(err)
        }
    
        //retornamos solo el nombre del archivo (luego de que el path ya se creo)
        resolve(idName)
        });
    });
    
};


export { subirArchivo }