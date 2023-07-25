const Job = require("../../models/Job");
const ErrorHandling = require("../../utils/errorHandler.js");
const User = require("../../models/userModel"); // Import the User model
const Role = require("../../models/role");

exports.createJob = async (req, res, next) => {
  try {
    const {
      service_Title,
      minimum_budget,
      service_Description,
      requirements,
      category,
      country,
      min_projectLength,
      max_projectLength,
      Proposal,
    } = req.body;

    const userId = req.params.userId; // Access user ID from query parameters

    // Get the user from the User collection
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandling("User not found", 404));
    }

    // Check if the user's role is 'buyer'
    const role = await Role.findOne({ role: "buyer" });
    if (!role) {
      return next(new ErrorHandling("Role not found", 500));
    }

    if (user.role.toString() !== role._id.toString()) {
      return next(new ErrorHandling("Only Buyers Can Post a Job", 403));
    }

    // Check if the user's email has been verified
    if (!user.email_verification) {
      return next(
        new ErrorHandling(
          "Email not verified. Please verify your email to send a proposal",
          403
        )
      );
    }

    // Check if the user has sufficient "thepa" value to post a job
    if (user.thepa < 10) {
      return next(
        new ErrorHandling(
          "You do not have sufficient thepa to post a job. Please buy some to continue",
          403
        )
      );
    }

    // Check if the user is posting the job again within 7 days
    const previousJob = await Job.findOne({
      User: userId,
      service_Title,
      minimum_budget,
      service_Description,
      requirements,
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }, // Check if created within the last 7 days
    });
    if (previousJob) {
      return next(
        new ErrorHandling(
          "User has already posted a similar job within the last 7 days",
          409
        )
      );
    }

    // Deduct 10 from thepa field in the user model
    user.thepa -= 10;
    await user.save(); // Save the updated user object

    const newJob = new Job({
      service_Title,
      minimum_budget,
      service_Description,
      requirements,
      category,
      country,
      User: userId, // Set the User field as the user ID
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
    return next(new ErrorHandling());
  }
};

exports.getAJob = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    // console.log(categoryId);
    const job = await Job.find({ category: { $in: [categoryId] } })
      .populate("category")
      .populate("job_level");
    // console.log(job);
    const count = job.length;
    if (count === 0) {
      return next(
        new ErrorHandling("No Jobs Of This Category Have Been Posted", 404)
      );
    }

    // Increment the count in the database
    await Job.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        count,
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling(" Internal Server Error", 500));
  }
};

exports.getAJobByID = async (req, res, next) => {
  try {
    const jobID = req.params.id;
      console.log(jobID);
    const job = await Job.findOne({ _id: jobID })
console.log(job);
    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling());
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const AllJobs = await Job.find().sort({ updatedAt: -1 });

    if (!AllJobs) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        count: AllJobs.length,
        AllJobs,
      });
    }
  } catch (error) {
    return next(new ErrorHandling());
  }
};

exports.deleteAJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
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
        message: "Job not found",
      });
    }
    return res.status(200).json({
      message: "Job updated",
      updateJob,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
