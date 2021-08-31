const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const { port } = require("./config");
const Person = require("./models/person");
// const { Mongoose } = require("mongoose");

console.log({ argV: process.argv });
app.use(express.static("build"));
app.use(cors());
morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(persons);
  });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name && !body.number) {
    return res.status(204).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((personSaved) => {
      res.json(personSaved.toJSON());
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const updatePerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, updatePerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  let length = Person.length;
  response.send(`
  <p>Phonebook has info for ${length} people</p>
  ${new Date()}`);
});

app.get("/ok", (req, res) => {
  res.send("<h1>This is the Phonebook server</h1>");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
