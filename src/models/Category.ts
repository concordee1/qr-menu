// src/models/Category.ts
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this category.'],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // YENİ EKLENEN ALAN
  imageUrl: {
    type: String,
    default: '/images/default-category.png' // İsteğe bağlı: Varsayılan bir resim belirleyebilirsiniz.
  }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);