const ProductSize = require('../models/productSizeModel');

const getAllProductSizes = (req, res) => {
  ProductSize.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

const getSizesByProductId = (req, res) => {
  const { product_id } = req.params;
  ProductSize.getByProductId(product_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


const getAllProductSizesById = (req, res) => {
  const { id } = req.params;
  ProductSize.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

const createProductSize = (req, res) => {
  const { product_id, size_id, stock_quantity } = req.body;
  if (!product_id || !size_id || stock_quantity == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  ProductSize.create({ product_id, size_id, stock_quantity }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product size created', id: result.insertId });
  });
};

const updateProductSize = (req, res) => {
  const { product_id, size_id, stock_quantity } = req.body;
  const { id } = req.params;

  ProductSize.update(id, { product_id, size_id, stock_quantity }, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product size updated' });
  });
};



const deleteProductSize = (req, res) => {
  const { id } = req.params;

  ProductSize.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product size deleted' });
  });
};

module.exports = {
  getAllProductSizes,
  getAllProductSizesById,
  createProductSize,
  updateProductSize,
  deleteProductSize,
  getSizesByProductId, 
};
