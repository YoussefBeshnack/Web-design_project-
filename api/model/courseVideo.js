import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    videoTitle: {
      type: String,
      required: true,
      trim: true
    },
    videoURL: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false
  }
);

const courseVideosSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    videos: {
      type: [videoSchema],
      default: []
    }
  },
  {
    versionKey: false
  }
);

courseVideosSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

courseVideosSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('CourseVideos', courseVideosSchema);
