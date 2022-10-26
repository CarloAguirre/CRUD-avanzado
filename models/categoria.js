import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        //Esta es la forma de vincular nuestras categorias con los usuario
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function(){ // <--- debemos utilizar una funcion normal para que 'this' apunte dentro del scope
    //extraeremos todos los valores de usuario excepto '__v,' y 'password'. Ademas, renombraremos '_id' por 'uid'
    //toObject() transformara la informacion en un objeto literal de JS
    const {__v, estado,...categoria} = this.toObject(); 
    return categoria;
};

const Categoria = model('Categoria', CategoriaSchema);

export{ Categoria };
