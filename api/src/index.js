require("dotenv").config();
require("reflect-metadata");
const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data-source");
const foodRoutes = require("./router/foodRoutes");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/foods", foodRoutes);

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Backend running on ${process.env.BACKEND_URL}`)
    );
  })
  .catch((err) => console.error(err));
