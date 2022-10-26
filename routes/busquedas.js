import { Router } from 'express';
import { getBusqueda } from '../controllers/busquedas.js';

const busquedas = Router()

busquedas.get('/:coleccion/:termino', getBusqueda )

export{
    busquedas
}