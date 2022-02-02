require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.static("build"));
app.use(express.json());

const Number = require("./models/number.js");

app.get("/api/phones", (req, res) => {
  Number.find({}).then((numbers) => res.json(numbers));
});

app.post("/api/phones", (request, response) => {
  const body = request.body;

  if (body.name === undefined || body.phone === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const phone = new Number({
    name: body.name,
    number: body.phone,
  });

  console.log(phone);

  phone.save().then((savedNote) => {
    response.json(savedNote);
  });
});
app.get("/api/phones/:id", (req, res) => {
  Number.findById(request.params.id).then((number) => {
    res.json(number);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Application running on http://localhost:${PORT}`);
});
