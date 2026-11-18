require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const sampleProducts = [
    {
        name: 'Wireless Mouse',
        sku: 'ELEC-MS-001',
        category: 'Electronics',
        price: 1299,
        quantity: 45,
        reorderLevel: 10,
        supplier: 'Logitech India'
    },
    {
        name: 'Mechanical Keyboard',
        sku: 'ELEC-KB-002',
        category: 'Electronics',
        price: 3499,
        quantity: 22,
        reorderLevel: 8,
        supplier: 'Keychron India'
    },
    {
        name: '27 Inch LED Monitor',
        sku: 'ELEC-MN-003',
        category: 'Electronics',
        price: 14999,
        quantity: 9,
        reorderLevel: 10,
        supplier: 'Dell Technologies'
    },
    {
        name: 'Bluetooth Headphones',
        sku: 'ELEC-HP-004',
        category: 'Electronics',
        price: 2749,
        quantity: 20,
        reorderLevel: 6,
        supplier: 'Sony India'
    },
    {
        name: 'Cotton Polo T-Shirt',
        sku: 'APRL-TS-005',
        category: 'Apparel',
        price: 799,
        quantity: 67,
        reorderLevel: 15,
        supplier: 'Allen Solly'
    },
    {
        name: 'Denim Slim Fit Jeans',
        sku: 'APRL-JN-006',
        category: 'Apparel',
        price: 1999,
        quantity: 11,
        reorderLevel: 12,
        supplier: 'Levis India'
    },
    {
        name: 'A4 Copier Paper Ream',
        sku: 'STNY-PP-007',
        category: 'Stationery',
        price: 320,
        quantity: 50,
        reorderLevel: 15,
        supplier: 'JK Paper'
    },
    {
        name: 'Spiral Notebook Pack of 5',
        sku: 'STNY-NB-008',
        category: 'Stationery',
        price: 250,
        quantity: 8,
        reorderLevel: 10,
        supplier: 'Classmate'
    },
    {
        name: 'Stainless Steel Water Bottle',
        sku: 'ACCS-WB-009',
        category: 'Accessories',
        price: 599,
        quantity: 35,
        reorderLevel: 10,
        supplier: 'Milton'
    },
    {
        name: 'Laptop Backpack',
        sku: 'ACCS-BP-010',
        category: 'Accessories',
        price: 1499,
        quantity: 18,
        reorderLevel: 5,
        supplier: 'Wildcraft'
    },
    {
        name: 'Ergonomic Office Chair',
        sku: 'FURN-CH-011',
        category: 'Furniture',
        price: 7499,
        quantity: 6,
        reorderLevel: 4,
        supplier: 'IKEA India'
    },
    {
        name: 'Study Table',
        sku: 'FURN-TB-012',
        category: 'Furniture',
        price: 3999,
        quantity: 2,
        reorderLevel: 4,
        supplier: 'IKEA India'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        await Product.deleteMany({});
        const inserted = await Product.insertMany(sampleProducts);
        console.log(`Seeded ${inserted.length} products`);
    } catch (err) {
        console.error(`Seeding failed: ${err.message}`);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();
