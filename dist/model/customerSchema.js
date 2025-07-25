import mongoose from "mongoose";
// Definindo o Schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // O campo "name" é obrigatório
    },
    email: {
        type: String,
        required: true,
        unique: true, // O campo "email" deve ser único
    },
    age: {
        type: Number,
        default: 18, // Caso o "age" não seja fornecido, o valor padrão é 18
    },
    // Relacionamento com produtos favoritos
    favoriteProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
    // Endereço do cliente
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    // Telefone do cliente
    phone: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, // O campo "createdAt" será preenchido com a data atual por padrão
    },
});
// Criando o Modelo a partir do Schema
export const Customer = mongoose.model("Customer", customerSchema);
