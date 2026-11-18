const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    adjustStock,
    deleteProduct,
    getLowStockProducts,
    getCategorySummary
} = require('../controllers/productController');
const {
    validateObjectId,
    validateCreateProduct,
    validateUpdateProduct,
    validateStockAdjustment
} = require('../middleware/validate');

const router = express.Router();

router.get('/low-stock', getLowStockProducts);
router.get('/summary', getCategorySummary);

router.post('/', validateCreateProduct, createProduct);
router.get('/', getAllProducts);
router.get('/:id', validateObjectId, getProductById);
router.put('/:id', validateObjectId, validateUpdateProduct, updateProduct);
router.patch('/:id/stock', validateObjectId, validateStockAdjustment, adjustStock);
router.delete('/:id', validateObjectId, deleteProduct);

module.exports = router;
