const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    primeiroNome: { type: String, required: true },
    ultimoNome: { type: String, required: true },
    telefones: { numero: { type:Number, required:true },
                 ddd: { type:Number, required:true },
        required: true },
    data_criacao: { type: Date, default: Date.now },
    ultimo_login: { type: Date, default: Date.now },
    data_atualizacao: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
