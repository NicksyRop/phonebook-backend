const { response } = require("express");
const express = require("express");
var morgan = require("morgan");
const app = express();

app.use(express.json());

app.use(morgan("combined"));

// request logger middleware is used before requets
// const requestLogger = (request, response, next) => {
//   console.log("Method", request.method);
//   console.log("Path", request.path);
//   console.log("Body", request.body);
//   console.log("...");

//   next();
// };
// app.use(requestLogger);

morgan(function (req, res) {
  return [tokens.req.body];
});

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const poeple = numbers.length;
app.get("/api/phones", (request, response) => {
  response.json(numbers);
});

app.get("/", (req, res) => {
  res.end("<h1>Hello world</h1>");
});

app.get("/info", (request, response) => {
  response.end(` Phonebook has info of ${poeple}  people ${new Date()} `);
});

app.delete("/api/phones/:id", (request, response) => {
  const id = Number(request.params.id);

  const phone = numbers.find((phone) => phone.id === id);

  console.log(phone);

  if (!phone) {
    return response.status(404).json({
      error: "Not found",
    });
  }
  numbers = numbers.filter((number) => number.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const MaxId =
    numbers.length > 0 ? Math.max(...numbers.map((phone) => phone.id)) : 0;
  return MaxId + 1;
};

app.post("/api/phones", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  } else if (numbers.find((num) => num.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const phone = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  numbers = numbers.concat(phone);
  response.json(phone);
});

// unknownEndpoint middleware is used after all the requests

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
