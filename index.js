require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.static("build"));
app.use(express.json());

const Number = require("./models/number.js");

app.get("/api/phones", (request, response) => {
  Number.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post("/api/phones", (request, response) => {
  const body = request.body;

  if (body.name === undefined || body.phone === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const phone = new Number({
    name: body.name,
    phone: body.phone,
  });

  phone.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get("/api/phones/:id", (request, response, next) => {
  Number.findById(request.params.id)
    .then((num) => {
      if (num) {
        response.json(num);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/phones/:id", (req, res, next) => {
  Number.findByIdAndRemove(req.params.id)
    .then((response) => res.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/phones/:id", (req, res, next) => {
  const body = req.body;

  const number = {
    name: body.name,
    phone: body.phoe,
  };

  Number.findByIdAndUpdate(req.params.id, number, { new: true })
    .then((newPhone) => res.json(newPhone))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Application running on http://localhost:${PORT}`);
});
