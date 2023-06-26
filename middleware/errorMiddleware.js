

exports.errorMiddleware = (err,req,res,next)=>{

   err.message = err.message || "Internal server Error"
   err.statusCode = err.statusCode || 500
   console.log(err);
   res.status(err.statusCode).json({
    success:false,
    message: err.message
   })
}