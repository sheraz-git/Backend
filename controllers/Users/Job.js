const Job = require("../../models/Job");
const ErrorHandling = require("../../utils/errorHandler.js")

exports.createJob = async (req, res,next) => {
  try {
    const {
      service_Title,
      minimum_budget,
      service_Description,
      category,
      country,
      User,
      job_level,
      min_experience,
      max_experience,
      min_projectLength,
      max_projectLength,
      Proposal,
    } = req.body;
   
    // Check if the Job already exists
    const existingJob = await Job.findOne({ service_Title });
    if (existingJob) {
      return next(new ErrorHandling("Service title Already Exist" , 409) )
      };
    

    const newJob = new Job({
      service_Title,
      minimum_budget,
      service_Description,
      category,
      country,
      User,
      job_level,
      min_experience,
      max_experience,
      min_projectLength,
      max_projectLength,
      Proposal,
    });

    // Save the job to the database
    await newJob.save();
    return res.status(201).json({
      message: "New job created",
      data: newJob,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling() )
  }
};

exports.getAJob = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);
    const job = await Job.find({ category: { $in: [categoryId] } }).populate("category").populate("job_level");
    console.log(job);

    // Increment the count in the database
    await Job.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    if (!job) {
      return next(new ErrorHandling("Job Not Found" , 404) )
    } else {
      return res.status(200).json({
        message: "Job data",
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling() )
  }
};


exports.getAJobByID = async (req, res) => {
  try {
    const jobID = req.params.id;
    const job = await Job.findOne({ _id: jobID })
      .populate("job_level category User"); // Populate multiple fields by separating them with a space

    if (!job) {
      return next(new ErrorHandling("Job Not Found" , 404) )
    } else {
      return res.status(200).json({
        message: "Job data",
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling() )
  }
};


exports.getAllJobs = async (req, res) => {
  try {
   
    const AllJobs = await Job.find().sort({updatedAt:-1})
       

    if (!AllJobs) {
      return next(new ErrorHandling("Job Not Found" , 404) )
    } else {
      return res.status(200).json({
        message: "Job data",
        count : AllJobs.length,
        AllJobs,
      });
    }
  } catch (error) {
    return next(new ErrorHandling() )
  }
};


exports.deleteAJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return next(new ErrorHandling("Job Not Found" , 404) )
    } else {
      return res.status(200).json({
        message: "Deleted_Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateAJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const update = req.body;
    const options = { new: true }; // Return the updated record

    const updateJob = await Job.findOneAndUpdate(
      { _id: jobId },
      update,
      options
    );
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
