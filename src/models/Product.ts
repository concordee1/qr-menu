// src/models/Product.ts
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // Kategori alanını aktif hale getiriyoruz
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Bu satır, bu alanın Category modeline bir referans olduğunu belirtir.
    required: [true, 'Please specify the category for this product.']
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);