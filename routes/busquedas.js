import { Router } from 'express';
import { getBusqueda } from '../controllers/busquedas.js';

const router = Router()

router.get('/:coleccion/:termino', getBusqueda )

export{
    router
}