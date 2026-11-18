require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Inventory and Data Management System API',
        endpoints: {
            createProduct: 'POST /api/products',
            getAllProducts: 'GET /api/products',
            getProductById: 'GET /api/products/:id',
            updateProduct: 'PUT /api/products/:id',
            adjustStock: 'PATCH /api/products/:id/stock',
            deleteProduct: 'DELETE /api/products/:id',
            lowStockReport: 'GET /api/products/low-stock',
            categorySummary: 'GET /api/products/summary'
        }
    });
});

app.use('/api/products', productRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
