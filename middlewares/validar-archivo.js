import { response } from "express";


const validarArchivoSubido = (req, res = response, next)=>{
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
          msg: 'No se ha subido ningún archivo'
        });
        return;
      }

      next()
};

export {validarArchivoSubido}