const Category = require('../models/categoryModel');

const getAllCategories = (req, res) => {
  Category.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getCategoryById = (req, res) => {
  const { id } = req.params;
  Category.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(results[0]);
  });
};

const createCategory = (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: 'All fields are required' });

  Category.create({ name, description }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Category created', id: result.insertId });
  });
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: 'All fields are required' });

  Category.update(id, { name, description }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category updated' });
  });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;
  Category.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category deleted' });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
