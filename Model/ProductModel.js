const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',  // Adding reference to the Category model
    },
    images: {
        type: [{
            type: String
        }],
        validate: {
            validator: function (images) {
                return images.length <= 5;
            },
            message: 'You can upload a maximum of 5 images only.'
        }
    },
    price: {
        type: Number,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Price cannot be negative!'
        }
    },
    pvValue: {
        type: Number,
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;