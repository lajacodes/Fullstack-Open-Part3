const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Goodness:${password}@cluster0.ljnkz.mongodb.net/person?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 4,
    required: true,
  },
  number: {
    type: Number,
    minLength: 8,
    required: true,
  },
});

const Person = mongoose.model("Person", noteSchema);

const person = new Person({
  name: "Arto Helas",
  number: 123456,
});

person.save().then((result) => {
  console.log(`added ${person} to phonebook`);
  mongoose.connection.close();
});

Person.find({ required: false }).then((result) => {
  result.forEach((person) => {
    console.log(person);
    mongoose.connection.close();
  });
});
