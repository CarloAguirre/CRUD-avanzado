import { Schema, model } from "mongoose";

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        required: true,
        default: 0
        
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    disponible: {type: Boolean, default: true},
    img: {type: String}
});

ProductoSchema.methods.toJSON = function(){ // <--- debemos utilizar una funcion normal para que 'this' apunte dentro del scope
    //extraeremos todos los valores de usuario excepto '__v,' y 'password'. Ademas, renombraremos '_id' por 'uid'
    //toObject() transformara la informacion en un objeto literal de JS
    const {__v,...producto} = this.toObject(); 
    return producto;
};

const Producto = model('Producto', ProductoSchema);

export{ Producto};
