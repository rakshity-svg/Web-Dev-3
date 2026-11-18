const mongoose = require('mongoose');

const SKU_PATTERN = /^[A-Z0-9-]+$/;
const ALLOWED_FIELDS = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'supplier'];

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!/^[a-fA-F0-9]{24}$/.test(id) || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }
    return next();
};

const validateFieldValues = (body, requireAll) => {
    const errors = [];

    if (requireAll || body.name !== undefined) {
        if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 120) {
            errors.push('Product name must be a string between 2 and 120 characters');
        }
    }

    if (requireAll || body.sku !== undefined) {
        if (typeof body.sku !== 'string' || !SKU_PATTERN.test(body.sku.trim().toUpperCase())) {
            errors.push('SKU must contain only letters, numbers, and hyphens');
        }
    }

    if (requireAll || body.category !== undefined) {
        if (typeof body.category !== 'string' || body.category.trim().length < 2 || body.category.trim().length > 60) {
            errors.push('Category must be a string between 2 and 60 characters');
        }
    }

    if (requireAll || body.price !== undefined) {
        if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
            errors.push('Price must be a non-negative number');
        }
    }

    if (requireAll || body.quantity !== undefined) {
        if (typeof body.quantity !== 'number' || !Number.isInteger(body.quantity) || body.quantity < 0) {
            errors.push('Quantity must be a non-negative integer');
        }
    }

    if (body.reorderLevel !== undefined) {
        if (typeof body.reorderLevel !== 'number' || !Number.isInteger(body.reorderLevel) || body.reorderLevel < 0) {
            errors.push('Reorder level must be a non-negative integer');
        }
    }

    if (body.supplier !== undefined) {
        if (typeof body.supplier !== 'string' || body.supplier.trim().length > 100) {
            errors.push('Supplier must be a string of at most 100 characters');
        }
    }

    return errors;
};

const validateCreateProduct = (req, res, next) => {
    if (!isPlainObject(req.body)) {
        return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    const errors = validateFieldValues(req.body, true);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    return next();
};

const validateUpdateProduct = (req, res, next) => {
    if (!isPlainObject(req.body)) {
        return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    const hasUpdatableField = ALLOWED_FIELDS.some((field) => req.body[field] !== undefined);
    if (!hasUpdatableField) {
        return res.status(400).json({ message: 'Provide at least one valid product field to update' });
    }

    const errors = validateFieldValues(req.body, false);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    return next();
};

const validateStockAdjustment = (req, res, next) => {
    if (!isPlainObject(req.body)) {
        return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    const { change } = req.body;
    if (change === undefined) {
        return res.status(400).json({ message: 'change field is required' });
    }

    if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
        return res.status(400).json({ message: 'change must be a non-zero integer' });
    }

    return next();
};

module.exports = {
    validateObjectId,
    validateCreateProduct,
    validateUpdateProduct,
    validateStockAdjustment
};
