const Proposal = require("../../models/proposalModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dsv28ungz",
  api_key: "775634257667667",
  api_secret: "6jMBqRlVALHfbR8udrS3fUf4m1A",
});

exports.addProposal = async (req, res) => {
  try {
    const { totalBids,
      servicesFee,
      payment,
      projectDuration,
      coverLetter,
      websiteLink,
      attachment} = req.body;

    const proposal = new Proposal({
        totalBids,
        servicesFee,
        payment,
        projectDuration,
        coverLetter,
        websiteLink,
        attachment
    });

    await proposal.save();

    return res.status(201).json({
      message: "Proposal is created",
      data: proposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    
    const portfolio = await Portfolio.findById(portfolioId);
  
    if (!portfolio) {
      return res.status(404).json({
        message: "portfolio not found",
      });
    } else {
      return res.status(200).json({
        message: "portfolio data",
        portfolio,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = await Portfolio.findByIdAndDelete(portfolioId);
   if (!portfolio) {
      return res.status(200).json({
        message: "portfolio doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "Deleted Succefully",
        
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const update = req.body;
    const options = { new: true }; // Return the updated record
  
    const updatePortfolio = await Portfolio.findOneAndUpdate({_id:portfolioId}, update, options);
    if (!updatePortfolio) {
      return res.status(404).json({
        message: "portfolio not found",
      });
    }
    return res.status(200).json({
      message: "portfolio updated",
      updatePortfolio,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};


