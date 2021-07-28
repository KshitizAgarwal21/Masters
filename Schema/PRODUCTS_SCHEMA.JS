var mongoose = require('mongoose');

const schema = new mongoose.Schema({

    Category: {
        type: String,
        required: true
    },
    Items: [{
        Subcategory: {
            type: String,
            required: true
        },
        Products: {
            type: Array
        }
    }]
})

const PRODUCTS_SCHEMA = mongoose.model("PRODUCT_DETAIL", schema);
module.exports = PRODUCTS_SCHEMA;