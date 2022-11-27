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
    img: {type: String},
    img2: {type: String},
    itinerario:{type: String},
    requisitos:{type: String},
    altura:{type: String},
    dificultad:{type: String},
    distancia:{type: String},
    tiempo:{type: String},
    incluye1:{type: String},
    incluye2:{type: String},
    incluye3:{type: String},
    incluye4:{type: String},
    incluye5:{type: String},
    incluye6:{type: String},
    noIncluye1:{type: String},
    noIncluye2:{type: String},
    noIncluye3:{type: String},
    noIncluye4:{type: String},
    noIncluye5:{type: String},
    noIncluye6:{type: String},
    necesario1:{type: String},
    necesario2:{type: String},
    necesario3:{type: String},
    necesario4:{type: String},
    necesario5:{type: String},
    necesario6:{type: String},
    necesario7:{type: String},
    necesario8:{type: String},
    necesario9:{type: String},
    necesario10:{type: String},
    necesario11:{type: String},
    necesario12:{type: String},
    necesario13:{type: String},
    necesario14:{type: String},
    necesario16:{type: String},
    necesario17:{type: String},
    necesario18:{type: String},
    necesario19:{type: String},
    necesario20:{type: String},
    necesario21:{type: String},
});

ProductoSchema.methods.toJSON = function(){ // <--- debemos utilizar una funcion normal para que 'this' apunte dentro del scope
    //extraeremos todos los valores de usuario excepto '__v,' y 'password'. Ademas, renombraremos '_id' por 'uid'
    //toObject() transformara la informacion en un objeto literal de JS
    const {__v,...producto} = this.toObject(); 
    return producto;
};

const Producto = model('Producto', ProductoSchema);

export{ Producto};
