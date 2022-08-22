const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    label:{
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    }
});
const promos = mongoose.model('promo', promoSchema);
module.exports = promos;