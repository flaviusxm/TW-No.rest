const express = require("express");
const cors = require("cors");
const database = require("./models");
const app = express();
app.use(cors());
app.use(express.json());
database.sequelize.sync().then(() => {console.log("All works and synched");}).catch((err) => console.error("Error:", err));

app.get("/", (req, res) => {
  res.send("Backend works also!");
});

const port = process.env.PORT || 9583
app.listen(port, () => {console.log(`Server runs on  ${port}`);});


