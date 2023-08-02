const Favorite = require("../../models/addToFavorite");

exports.favoriteAdded = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const existingFavorite = await Favorite.findOne({ jobId });
    if (existingFavorite) {
      return res.status(400).json({ error: "Favorite already exists for Job" });
    }

    const newFavorite = new Favorite({
      userId,
      jobId,
    });

    await newFavorite.save();
    return res.status(201).json(newFavorite);
  } catch (error) {
    console.log("Error", error);
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