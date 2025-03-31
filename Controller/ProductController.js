const ProductModel = require("../Model/ProductModel");
const multer = require('multer');
const path = require('path');
const CategoryModel = require("../Model/CategoryModel");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        let product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ succss: false, message: 'Product not found' });
        }
        if (req.files.image) {
            updates.image = req.files.image[0].path;
        }
        if (req.files.images) {
            updates.images = req.files.images.map(file => file.path).slice(0, 5);
        }
        Object.assign(product, updates);
        await product.save();

        return res.status(200).json({ succss: true, message: "Product has been Updated" })
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message })
    }
}


const calculateProductStats = async (req, res) => {
    try {
        const products = await ProductModel.find();
        if (!products.length) {
            return res.status(404).json({ succss: false, message: 'No products found' });
        }

        const totalPvValue = products.reduce((sum, product) => sum + (product.pvValue || 0), 0);
        const averagePrice = products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length;

        return res.status(200).json({
            succss: true,
            averagePrice: averagePrice.toFixed(2),
            totalPvValue
        });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};

const groupProductsByPriceRange = async (req, res) => {
    try {
        const products = await ProductModel.find();
        if (!products.length) {
            return res.status(404).json({  succss: false, message: 'No products found' });
        }

        const priceRanges = {
            '0-100': [],
            '101-500': [],
            '501-1000': [],
            '1000+': []
        };

        products.forEach(product => {
            if (product.price <= 100) {
                priceRanges['0-100'].push(product);
            } else if (product.price <= 500) {
                priceRanges['101-500'].push(product);
            } else if (product.price <= 1000) {
                priceRanges['501-1000'].push(product);
            } else {
                priceRanges['1000+'].push(product);
            }
        });

        return res.status(200).json({ succss: true, data: priceRanges });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};

const getHighestPricedProductByCategory = async (req, res) => {
    try {
        const products = await ProductModel.aggregate([
            {
                $group: {
                    _id: "$categoryId",
                    highestPricedProduct: { $max: "$price" },
                    product: { $first: "$$ROOT" }
                }
            }
        ]);
        return res.status(200).json({ succss: true, data: products });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};


const updateCategoryDescription = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { description } = req.body;
        const category = await CategoryModel.findByIdAndUpdate(
            categoryId,
            { description },
        );

        if (!category) {
            return res.status(404).json({ succss: false, message: 'Category not found' });
        }
        await ProductModel.updateMany(
            { categoryId },
            { $set: { description: description } }
        );

        return res.status(200).json({ succss: true, message: 'Category and related products has been updated' });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};

const getPaginatedProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'price', order = 'asc', categoryId } = req.query;
        const filter = {};
        if (categoryId) filter.categoryId = categoryId;

        const products = await ProductModel.find(filter)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        return res.status(200).json({ succss: true, data: products });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};


const searchProducts = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ succss: false, message: 'Search term is required' });
        }

        const products = await ProductModel.find({
            $or: [
                { productName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        });

        return res.status(200).json({ succss: true, data: products });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message, });
    }
};


module.exports = { UpdateProduct, upload, calculateProductStats, groupProductsByPriceRange, getHighestPricedProductByCategory, updateCategoryDescription, getPaginatedProducts, searchProducts };