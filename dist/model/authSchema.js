import mongoose from "mongoose";
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    clientId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        }],
});
export const Auth = mongoose.model("Auth", authSchema); // api-node - users
