const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: [2, 'Product name must be at least 2 characters'],
            maxlength: [120, 'Product name cannot exceed 120 characters']
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
            uppercase: true,
            match: [/^[A-Z0-9-]+$/, 'SKU can only contain uppercase letters, numbers, and hyphens']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            minlength: [2, 'Category must be at least 2 characters'],
            maxlength: [60, 'Category cannot exceed 60 characters'],
            index: true
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be an integer'
            }
        },
        reorderLevel: {
            type: Number,
            default: 10,
            min: [0, 'Reorder level cannot be negative'],
            validate: {
                validator: Number.isInteger,
                message: 'Reorder level must be an integer'
            }
        },
        supplier: {
            type: String,
            trim: true,
            maxlength: [100, 'Supplier name cannot exceed 100 characters'],
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.virtual('stockValue').get(function () {
    return Number((this.price * this.quantity).toFixed(2));
});

module.exports = mongoose.model('Product', productSchema);
