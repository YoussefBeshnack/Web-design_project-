import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    students: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      dateEnrolled: {type: String, required: true, default: new Date().toISOString()}
    }],
    categories: [ { type: String, lowercase: true, trim: true }],
    visits: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
  },
  { 
    versionKey: false
  }
);

// Hide _id in API responses
courseSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

courseSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('Course', courseSchema);