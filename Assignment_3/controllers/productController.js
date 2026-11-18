const Product = require('../models/Product');

const ALLOWED_FIELDS = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'supplier'];
const SORTABLE_FIELDS = new Set([
    'name',
    'sku',
    'category',
    'price',
    'quantity',
    'reorderLevel',
    'supplier',
    'createdAt',
    'updatedAt'
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickAllowedFields = (body) => {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) {
            data[field] = body[field];
        }
    }
    return data;
};

const parseNonNegativeNumber = (rawValue, fieldName) => {
    if (rawValue === undefined || rawValue === '') {
        return { provided: false, value: null, error: null };
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
        return { provided: true, value: null, error: `${fieldName} must be a non-negative number` };
    }
    return { provided: true, value: parsed, error: null };
};

const parseSortOption = (sortQuery, sortByQuery, orderQuery) => {
    const sortObj = {};
    const defaultDirection =
        typeof orderQuery === 'string' && (orderQuery.toLowerCase() === 'desc' || orderQuery === '-1')
            ? -1
            : 1;

    if (typeof sortQuery === 'string' && sortQuery.trim() !== '') {
        const parts = sortQuery.split(',');
        for (const rawPart of parts) {
            const part = rawPart.trim();
            if (!part) {
                continue;
            }
            if (part.startsWith('-')) {
                const field = part.slice(1).trim();
                if (SORTABLE_FIELDS.has(field)) {
                    sortObj[field] = -1;
                }
            } else if (part.includes(':')) {
                const [rawField, rawDir] = part.split(':');
                const field = rawField.trim();
                const dir =
                    rawDir && (rawDir.trim().toLowerCase() === 'desc' || rawDir.trim() === '-1')
                        ? -1
                        : 1;
                if (SORTABLE_FIELDS.has(field)) {
                    sortObj[field] = dir;
                }
            } else if (SORTABLE_FIELDS.has(part)) {
                sortObj[part] = defaultDirection;
            }
        }
    } else if (typeof sortByQuery === 'string' && SORTABLE_FIELDS.has(sortByQuery.trim())) {
        sortObj[sortByQuery.trim()] = defaultDirection;
    }

    if (Object.keys(sortObj).length === 0) {
        return { createdAt: -1, _id: -1 };
    }

    return sortObj;
};

const createProduct = async (req, res, next) => {
    try {
        const payload = pickAllowedFields(req.body);
        const product = await Product.create(payload);
        return res.status(201).json(product);
    } catch (err) {
        return next(err);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const filter = {};

        if (typeof req.query.category === 'string' && req.query.category.trim() !== '') {
            filter.category = {
                $regex: `^${escapeRegex(req.query.category.trim())}$`,
                $options: 'i'
            };
        }

        if (typeof req.query.supplier === 'string' && req.query.supplier.trim() !== '') {
            filter.supplier = {
                $regex: escapeRegex(req.query.supplier.trim()),
                $options: 'i'
            };
        }

        if (typeof req.query.sku === 'string' && req.query.sku.trim() !== '') {
            filter.sku = req.query.sku.trim().toUpperCase();
        }

        const searchTerm =
            typeof req.query.search === 'string' && req.query.search.trim() !== ''
                ? req.query.search.trim()
                : typeof req.query.q === 'string' && req.query.q.trim() !== ''
                  ? req.query.q.trim()
                  : '';

        if (searchTerm) {
            const pattern = { $regex: escapeRegex(searchTerm), $options: 'i' };
            filter.$or = [
                { name: pattern },
                { sku: pattern },
                { category: pattern },
                { supplier: pattern }
            ];
        }

        const minPrice = parseNonNegativeNumber(req.query.minPrice, 'minPrice');
        if (minPrice.error) {
            return res.status(400).json({ message: minPrice.error });
        }

        const maxPrice = parseNonNegativeNumber(req.query.maxPrice, 'maxPrice');
        if (maxPrice.error) {
            return res.status(400).json({ message: maxPrice.error });
        }

        if (minPrice.provided && maxPrice.provided && minPrice.value > maxPrice.value) {
            return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice' });
        }

        if (minPrice.provided || maxPrice.provided) {
            filter.price = {};
            if (minPrice.provided) {
                filter.price.$gte = minPrice.value;
            }
            if (maxPrice.provided) {
                filter.price.$lte = maxPrice.value;
            }
        }

        const minQuantity = parseNonNegativeNumber(req.query.minQuantity, 'minQuantity');
        if (minQuantity.error) {
            return res.status(400).json({ message: minQuantity.error });
        }

        const maxQuantity = parseNonNegativeNumber(req.query.maxQuantity, 'maxQuantity');
        if (maxQuantity.error) {
            return res.status(400).json({ message: maxQuantity.error });
        }

        if (minQuantity.provided && maxQuantity.provided && minQuantity.value > maxQuantity.value) {
            return res.status(400).json({ message: 'minQuantity cannot be greater than maxQuantity' });
        }

        if (minQuantity.provided || maxQuantity.provided) {
            filter.quantity = {};
            if (minQuantity.provided) {
                filter.quantity.$gte = minQuantity.value;
            }
            if (maxQuantity.provided) {
                filter.quantity.$lte = maxQuantity.value;
            }
        }

        if (req.query.inStock === 'true') {
            filter.quantity = { ...(filter.quantity || {}), $gt: 0 };
        } else if (req.query.inStock === 'false') {
            filter.quantity = 0;
        }

        if (req.query.lowStock === 'true') {
            filter.$expr = { $lte: ['$quantity', '$reorderLevel'] };
        }

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;
        const sortOption = parseSortOption(req.query.sort, req.query.sortBy, req.query.order);

        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter).sort(sortOption).skip(skip).limit(limit)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            total,
            page,
            totalPages,
            count: products.length,
            products
        });
    } catch (err) {
        return next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (err) {
        return next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const updates = pickAllowedFields(req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, updates, {
            returnDocument: 'after',
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (err) {
        return next(err);
    }
};

const adjustStock = async (req, res, next) => {
    try {
        const { change } = req.body;

        if (change < 0) {
            const product = await Product.findOneAndUpdate(
                { _id: req.params.id, quantity: { $gte: Math.abs(change) } },
                { $inc: { quantity: change } },
                { returnDocument: 'after', runValidators: true }
            );
            if (!product) {
                const exists = await Product.exists({ _id: req.params.id });
                if (!exists) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                return res.status(400).json({ message: 'Insufficient stock for this adjustment' });
            }
            return res.status(200).json({ message: 'Stock updated', product });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: change } },
            { returnDocument: 'after', runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Stock updated', product });
    } catch (err) {
        return next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({
            message: 'Product deleted',
            id: product._id
        });
    } catch (err) {
        return next(err);
    }
};

const getLowStockProducts = async (req, res, next) => {
    try {
        const lowStockItems = await Product.aggregate([
            {
                $match: {
                    $expr: { $lte: ['$quantity', '$reorderLevel'] }
                }
            },
            {
                $sort: { quantity: 1, _id: -1 }
            },
            {
                $addFields: {
                    stockValue: { $round: [{ $multiply: ['$price', '$quantity'] }, 2] },
                    id: { $toString: '$_id' }
                }
            }
        ]);

        return res.status(200).json({
            count: lowStockItems.length,
            lowStockItems
        });
    } catch (err) {
        return next(err);
    }
};

const getCategorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalItems: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
                    avgPrice: { $avg: '$price' }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalItems: 1,
                    totalQuantity: 1,
                    totalStockValue: { $round: ['$totalStockValue', 2] },
                    avgPrice: { $round: ['$avgPrice', 2] }
                }
            },
            {
                $sort: { totalStockValue: -1 }
            }
        ]);

        return res.status(200).json({
            categories: summary.length,
            summary
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    adjustStock,
    deleteProduct,
    getLowStockProducts,
    getCategorySummary
};
