const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const { PORT } = require("./config");
const Person = require("./models/person");
const { Person } = require("./models/person");
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
  const update = request.body;

  const updatePerson = {
    name: update.name,
    number: update.number,
  };

  Person.findByIdAndUpdate(request.params.id, updatePerson, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.send(updatedPerson);
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

app.delete("/api/persons/:id", (req, res, next) => {
  const deleteId = req.params.id;
  Person.findByIdAndRemove(deleteId)
    .then((deleteOne) => {
      if (deleteOne) res.status(204).end();
      else res.status(409).send({ error: "id not found" });
    })
    .catch((error) => next(error));
});
// app.delete("/api/persons/:id", (req, res, next) => {
//   const deleteId = request.params.id;
//   Person.findByIdAndRemove(deleteId)
//     .then((result) => res.status(204).end())
//     .catch((error) => next(error));
// });

app.get("/info", (req, res) => {
  let length = Person.length;
  res.send(`
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
