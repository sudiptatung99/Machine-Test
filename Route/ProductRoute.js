const express = require("express");
const { upload, UpdateProduct, calculateProductStats, groupProductsByPriceRange, getHighestPricedProductByCategory, updateCategoryDescription, getPaginatedProducts, searchProducts } = require("../Controller/ProductController");
const router = express.Router();

router.put('/products/:id', upload, UpdateProduct);
router.get('/products/stats', calculateProductStats);
router.get('/products/price-range', groupProductsByPriceRange);
router.get('/products/highest-priced', getHighestPricedProductByCategory);
router.put('/categories/:categoryId', updateCategoryDescription);
router.get('/products', getPaginatedProducts);
router.get('/products/search', searchProducts);

module.exports=router