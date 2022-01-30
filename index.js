const { response } = require("express");
const express = require("express");

const app = express();

app.use(express.json());

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

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  console.log(generateId());

  const phone = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  numbers = numbers.concat(phone);
  response.json(phone);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
