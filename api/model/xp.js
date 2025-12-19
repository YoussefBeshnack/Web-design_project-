import mongoose from 'mongoose';

const xpSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    points: {type: Number, required: true, default: 0}
  },
  {
    versionKey: false,
  }
);

xpSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

xpSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('Xp', xpSchema);