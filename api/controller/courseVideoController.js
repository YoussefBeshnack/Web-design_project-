import CourseVideo from '../model/courseVideo.js'

const getAllCourseVideos = async (req, res) => {
  try {
    const courseVideos = await CourseVideo.find({});
    res.status(200).json(courseVideos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const addCourseVideo = async (req, res) => {
  try {
    const { id, videos } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const newCourseVideo = new CourseVideo({
      id,
      videos
    });

    const savedCourseVideo = await newCourseVideo.save();

    res.status(201).json({
      message: 'courseVideo created successfully',
      courseVideo: savedCourseVideo,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Id already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
}

const syncCourseVideos = async (req, res) => {
  try {
    const courseVideos = req.body;

    if (!Array.isArray(courseVideos)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array"
      });
    }

    if (courseVideos.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nothing to sync",
        result: { matched: 0, upserted: 0 }
      });
    }

    const ops = courseVideos.map(courseVideo => ({
      updateOne: {
        filter: { id: courseVideo.id },
        update: { $set: courseVideo },
        upsert: true
      }
    }));

    const result = await CourseVideo.bulkWrite(ops);

    return res.status(200).json({
      success: true,
      message: "Sync completed",
      result: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Sync failed",
      error: err.message
    });
  }
}

const deleteCourseVideo = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide ID to delete the courseVideo"
      });
    }

    const query = { id };

    const result = await CourseVideo.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "courseVideo not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "courseVideo deleted successfully"
    });

  } catch (error) {
    console.error("Delete courseVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete courseVideo",
      error: error.message
    });
  }
}


const courseVideo = {
  getAllCourseVideos,
  addCourseVideo,
  syncCourseVideos,
  deleteCourseVideo,
};

export default courseVideo;
