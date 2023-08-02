const express = require("express");
const connectToMongo = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const contactUs = require("./routes/contactUs.js");
const seederRoutes = require("./routes/seederRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const category = require("./routes/categoryroutes.js");
const proposalRoutes = require("./routes/proposalRoutes.js");
const favoriteRoutes = require("./routes/addToFavorite.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

const errorMiddleware = require("./middleware/errorMiddleware.js");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectToMongo();

app.use(
  cors({
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "worked  fine",
  });
});

app.use(
  "/api",
  userRoutes,
  adminRoutes,
  contactUs,
  category,
  seederRoutes,
  jobRoutes,
  proposalRoutes,
  chatRoutes,
  messageRoutes,
  favoriteRoutes,
  (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  }
);

app.use(errorMiddleware.errorMiddleware);

app.listen(port, () => {
  console.log("working");
});
