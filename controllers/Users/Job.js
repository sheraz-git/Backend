const Job = require("../../models/Job");
exports.PostAJob = async (req, res) => {
  try {   
    const { service_Title, minimum_budget,service_Description,category,country,User} = req.body;
    console.log("body", req.body);
    // console.log("ID", req.body.User);
    // Check if the Job already exists
    const existingJob = await Job.findOne({ service_Title });
    if (existingJob) {
      return res.status(409).json({
        message: "service_Title already exists",
      });
    }

    const newJob = new Job({
      service_Title,
      minimum_budget,
      service_Description,
      category,
      country,
      User
    });

    // Save the job to the database
    await newJob.save();
    return res.status(201).json({
      message: "New job created",
      data: newJob
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


exports.getAJob = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);
    const job = await Job.find({ category: { $in: [categoryId] } }).populate("category");
    console.log(job);

    // Increment the count in the database
    await Job.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    } else {
      return res.status(200).json({
        message: "Job data",
        job,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAJobByID = async (req, res) => {
  try {
    const jobID = req.params.id;
    const job = await Job.findOne({ _id: jobID }).populate("category").populate("User");    
    if (!job) {
      return res.status(200).json({
        message: "job doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "job data",
        job,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
exports.deleteAJob = async (req, res) => {
  try {
    const jobid = req.params.id;
    const job = await Job.findByIdAndDelete(jobid);
   if (!job) {
      return res.status(200).json({
        message: "user doesn't exist",
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

exports.updateAJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const update = req.body;
    const options = { new: true }; // Return the updated record
  
    const updateJob = await Job.findOneAndUpdate({ _id: jobId }, update, options);
    console.log("hh");
    if (!updateJob) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    return res.status(200).json({
      message: "user updated",
      updateJob,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
// //delete Seller///
// exports.deleteUser = async (req, res) => {
//   try {
//     const userid = req.params.id;
//     const user = await User.findOneAndDelete({ _id: userid });
//    if (!user) {
//       return res.status(200).json({
//         message: "user doesn't exist",
//       });
//     } else {
//       return res.status(200).json({
//         message: "Deleted Succefully",
        
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };


// // Update seller
// exports.UserUpdate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const update = req.body;
//     const options = { new: true }; // Return the updated record
//   if (update.password) {
//       update.password = await bcrypt.hash(update.password, 10);
//     }
//     const userupdate = await User.findByIdAndUpdate(id, update, options);
//     if (!userupdate) {
//       return res.status(404).json({
//         message: "user not found",
//       });
//     }
//     return res.status(200).json({
//       message: "user updated",
//       userupdate,
//     });
//   } catch (error) {
//     console.error(error); // Log the error message for debugging
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };