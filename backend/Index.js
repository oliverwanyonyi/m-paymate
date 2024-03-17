const express = require("express");
const app = express();
const port = 3001;
const sequelize = require("./models");
const db = require("./models");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const expenditureRoutes = require("./routes/expenditureRoutes");
const billRoutes = require("./routes/billRoutes");
const budgetRoutes = require('./routes/budgetRoutes')
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/expenditure", expenditureRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/budget", budgetRoutes);


// Middleware to handle not found routes (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware to handle errors (500)
app.use((err, req, res, next) => {
  // Set the status code to 500 if it's not already set
  res.status(err.status || 500);
  // Send the error message in the response
  res.json({
    error: {
      message: err.message,
    },
  });
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
    app.listen(3001, () => {
      console.log("Server is running on port 3001.");
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
