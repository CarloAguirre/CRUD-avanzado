import express from 'express'
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { dbConnection } from '../database/config.js';
import { router } from '../routes/users.js';
import { router as authLogin } from '../routes/login-auth.js';
import { router as categorias } from '../routes/categorias.js';
import { router as productos } from '../routes/productos.js';
import { router as uploads } from '../routes/uploads.js';
import { router as busquedas } from '../routes/busquedas.js';


class Server{
    
    constructor(){
        //constantes
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath   = '/api/usuarios';
        this.authPath       = '/api/auth';
        this.categoriaPath  = '/api/categorias';
        this.productosPath  = '/api/productos';
        this.buscarPath     = '/api/buscar';
        this.uploadsPath    = '/api/uploads'

        // Constructores //

        //conectar a la base de datos
        this.conectarDB();
        //middlewares
        this. middlewares();
        //rutas de la aplicacion
        this.routes();
    };
    
    // METODOS //

    async conectarDB(){
        await dbConnection()
    };
    
    middlewares(){
        this.app.use(cors());       // <--- ayuda a controlar el intercambio de recursos HTTP (evita errores cross domain acces)
        this.app.use(express.static('public'))

        //lectura y parseo del body
        this.app.use(express.json())

        // configuracion necesaria para express-fileupload
        this.app.use(fileUpload({
            // limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    };
    
    //rutas
    routes(){
        this.app.use(this.usuariosPath, router)
        //validacion de login
        this.app.use(this.authPath, authLogin)
        //categorias
        this.app.use(this.categoriaPath, categorias)
        //productos
        this.app.use(this.productosPath, productos)
        //busquedas generales
        this.app.use(this.buscarPath, busquedas)
        //cargar archivos
        this.app.use(this.uploadsPath, uploads )
    };

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Listening on port ${this.port}`)
        })
    };

};

export{
    Server
}