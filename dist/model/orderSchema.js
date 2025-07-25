import mongoose from "mongoose";
// Definindo o Schema de Pedido
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Middleware para atualizar updatedAt
orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Criando o Modelo a partir do Schema
export const Order = mongoose.model("Order", orderSchema);
