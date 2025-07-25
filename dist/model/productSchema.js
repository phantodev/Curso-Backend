import mongoose from "mongoose";
// Definindo o Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // O campo "name" é obrigatório
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, // O campo "createdAt" será preenchido com a data atual por padrão
    },
    clientId: {
        type: String,
        required: true,
    },
});
// Criando o Modelo a partir do Schema
export const Product = mongoose.model("Product", productSchema);
