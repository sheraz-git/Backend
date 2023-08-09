const Favorite = require("../../models/addToFavorite");
const Job = require("../../models/Job");

exports.favoriteAdded = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const existingFavorite = await Favorite.findOne({ userId, jobId });
    if (existingFavorite) {
      return res.status(400).json({ error: "Favorite already exists for Job" });
    }

    const newFavorite = new Favorite({
      userId,
      jobId,
    });

    await newFavorite.save();

    await Job.findByIdAndUpdate(jobId, { isFavorite: true });

    return res.status(201).json(newFavorite);
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: "Failed to create a favorite" });
  }
};
exports.getAllFavorite = async (req, res) => {
    try {
      const { id } = req.params;
      const favorites = await Favorite.find({ userId: id }).populate("userId").populate("jobId")
      return res.json(favorites);
    } catch (error) {
      console.log("Error", error);
      return res.status(500).json({ error: "Failed to retrieve favorites" });
    }
  };



  exports.deleteFavorites = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedFavorites = await Favorite.findOneAndDelete({ _id: id });

      if (!deletedFavorites) {
        return res.status(404).json({ error: "Favorites not found" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error", error);
      return res.status(500).json({ error: "Failed to delete favorites" });
    }
  };
