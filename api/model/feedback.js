import mongoose from 'mongoose';

const singleFeedbackSchema = new mongoose.Schema({
  userId: { type: String },
  stars: { type: Number, min: 1, max: 5 },
  comment: { type: String }
},
{
  versionKey: false
}
);

singleFeedbackSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

singleFeedbackSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

const feedbackSchema = new mongoose.Schema(
  {
    courseId: { type: Number, required: true, unique: true },
    feedbacks: [singleFeedbackSchema]
  },
  {
    versionKey: false,
  }
);

feedbackSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

feedbackSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('Feedback', feedbackSchema);