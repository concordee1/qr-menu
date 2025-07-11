// src/models/Setting.ts
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
