const express = require('express')
const morgan = require('morgan')
const app = express()


morgan.token('data', req =>  {
    return JSON.stringify(req.body)
}) 
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res) => 
    res.send(persons))

 app.get('/info', (request, response) => {
 let length = persons.length
  response.send(`
  <p>Phonebook has info for ${length} people</p>
  ${new Date()}`
  );
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(pers => pers.id === id)
    if(person){
      return res.json(person)
     }
    else{
      return res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
   persons = persons.filter(pers => pers.id !== id)
  res.status(204).end()
})







 const generateId = () => {
  const highest = persons.length > 0 
  ? Math.max(...persons.map(per => per.id))
  :0
   return highest + 1
}

app.post('/api/persons',  (req, res)=> {
    const body = req.body

    if(!body.name || !body.number){
     return  res.status(204).json({ 
      error: 'content missing' 
    })
    }else if(persons.find(per => per.name === body.name)){
    res.status(409).json({
      error: 'name must be unique'
    })
  }
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})



const PORT = 3005
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`)
})                                      