const { DataSource } = require("typeorm");
const path = require("path");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  synchronize: false,
  entities: [path.join(__dirname, "model/*.js")],
});

module.exports = AppDataSource;
