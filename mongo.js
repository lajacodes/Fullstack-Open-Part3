// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }

// const password = process.argv[2];

// const url = `mongodb+srv://Goodness:${password}@cluster0.ljnkz.mongodb.net/person?retryWrites=true&w=majority`;

// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model("Person", personSchema);

// if (process.argv.length === 3) {
//   console.log("Phonebook:");
//   Person.find({}).then((result) => {
//     result.forEach((person) => console.log(person.name, person.number));
//     mongoose.connection.close();
//   });
// } else {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   person.save().then(() => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }
//

//  else if (persons.find((per) => per.name === body.name)) {
//     res.status(409).json({
//       error: "name must be unique",
//     });
//   }
// const generateId = () => {
//   const highest =
//     persons.length > 0 ? Math.max(...persons.map((per) => per.id)) : 0;
//   return highest + 1;
// };
