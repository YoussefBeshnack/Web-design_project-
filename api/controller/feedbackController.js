import Feedback from '../model/feedback.js'

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { courseId, feedbacks } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'CourseId is required' });
    }

    const newFeedback = new Feedback({
      courseId,
      feedbacks
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      message: 'feedback created successfully',
      feedback: savedFeedback,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Id already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
}

const syncFeedbacks = async (req, res) => {
  try {
    const feedbacks = req.body;

    if (!Array.isArray(feedbacks)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array"
      });
    }

    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nothing to sync",
        result: { matched: 0, upserted: 0 }
      });
    }

    const ops = feedbacks.map(feedback => ({
      updateOne: {
        filter: { courseId: feedback.courseId },
        update: { $set: feedback },
        upsert: true
      }
    }));

    const result = await Feedback.bulkWrite(ops);

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

const deleteFeedback = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide CourseId to delete the feedback"
      });
    }

    const query = { courseId };

    const result = await Feedback.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });

  } catch (error) {
    console.error("Delete feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message
    });
  }
}


const feedback = {
  getAllFeedbacks,
  addFeedback,
  syncFeedbacks,
  deleteFeedback,
};

export default feedback;
