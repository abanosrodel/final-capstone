const Size = require('../models/sizeModel');

const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.getAllSizes();
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSize = async (req, res) => {
  try {
    const size = await Size.getSizeById(req.params.id);
    if (!size) return res.status(404).json({ message: 'Size not found' });
    res.json(size);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSize = async (req, res) => {
  const { label, description } = req.body;
  if (!label || !description)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const id = await Size.createSize(label, description);
    res.status(201).json({ message: 'Size created', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSize = async (req, res) => {
  const { label, description } = req.body;
  const { id } = req.params;

  try {
    const result = await Size.updateSize(id, label, description);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Size not found' });

    res.json({ message: 'Size updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSize = async (req, res) => {
  try {
    const result = await Size.deleteSize(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Size not found' });

    res.json({ message: 'Size deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSizes,
  getSize,
  createSize,
  updateSize,
  deleteSize,
};
