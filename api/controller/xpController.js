import Xp from '../model/xp.js'

const getAllXps = async (req, res) => {
  try {
    const xps = await Xp.find({});
    res.status(200).json(xps);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const addXp = async (req, res) => {
  try {
    const { userId, points } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    const newXp = new Xp({
      userId,
      points
    });

    const savedXp = await newXp.save();

    res.status(201).json({
      message: 'xp created successfully',
      xp: savedXp,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Id already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
}

const syncXps = async (req, res) => {
  try {
    const xps = req.body;

    if (!Array.isArray(xps)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array"
      });
    }

    if (xps.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nothing to sync",
        result: { matched: 0, upserted: 0 }
      });
    }

    const ops = xps.map(xp => ({
      updateOne: {
        filter: { userId: xp.userId },
        update: { $set: xp },
        upsert: true
      }
    }));

    const result = await Xp.bulkWrite(ops);

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

const deleteXp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId to delete the xp"
      });
    }

    const query = { userId };

    const result = await Xp.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "xp not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "xp deleted successfully"
    });

  } catch (error) {
    console.error("Delete xp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete xp",
      error: error.message
    });
  }
}


const xp = {
  getAllXps,
  addXp,
  syncXps,
  deleteXp,
};

export default xp;
