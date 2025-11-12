const Product = require('../models/productModel')

// Get all products
const getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err })

    // Parse images string back to array
    const parsedResults = results.map(product => ({
      ...product,
      image: product.image ? JSON.parse(product.image) : []
    }))

    res.json(parsedResults)
  })
}

// Get product by ID
const getProductById = (req, res) => {
  Product.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err })
    if (!result.length) return res.status(404).json({ message: 'Product not found' })

    const product = result[0]
    product.image = product.image ? JSON.parse(product.image) : []

    res.json(product)
  })
}

// Create product
const createProduct = (req, res) => {
  const images = req.files ? req.files.map(file => file.filename) : []
  const data = {
    ...req.body,
    image: JSON.stringify(images)
  }

  Product.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err })
    res.status(201).json({ message: 'Product added successfully' })
  })
}

// Update product
const updateProduct = (req, res) => {
  const images = req.files ? req.files.map(file => file.filename) : []
  const data = {
    ...req.body,
    image: JSON.stringify(images)
  }

  Product.update(req.params.id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err })
    res.json({ message: 'Product updated successfully' })
  })
}

// Delete product
const deleteProduct = (req, res) => {
  Product.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err })
    res.json({ message: 'Product deleted successfully' })
  })
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
