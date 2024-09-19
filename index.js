const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
//const cors = require('cors')
//app.use(cors({ origin: 'http://localhost:5173' }));
const morgan = require('morgan')


morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

var currentDate = new Date(); 
var currentDateString = currentDate.toString();
  let persons = [
    {
      id: "2",
      name: "Joe",
      number: "544302"
    },
    {
      id: "3",
      name: "Amy",
      number: "544303"
    },
    {
      id: "5",
      name: "Tony",
      number: "544305"
    }
  ]
  let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: false
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: false
    },
    {
      id: "6",
      content: "sdsda\\dd",
      important: true
    },
    {
      id: "8",
      content: "fcsccccz\\c",
      important: true
    }
  ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} notes </br> ${currentDateString}`); 
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  id = request.params.id
  const person = persons.find(person=>person.id ==id)
  if (person) {
    response.json(person)
  } else{
        response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {

    id = request.params.id
    persons = persons.filter(person=>person.id != id)
    response.status(204).end()

})

const generateID = () => {
    const maxId =persons.length > 0
        ? Math.max(...persons.map(n => Number(n.id))) 
        : 0
    return String(maxId + 1)
}


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({ 
            error: 'The name or number are missing' 
        })
    }


    const person = {
        id: generateID(),
        name: body.name,
        number:body.number,
    }

    const duplicate = persons.find(notecheck =>notecheck.name ==person.content)
    if (duplicate) {
        return response.status(400).json({ 
            error: `The name ${person.name} already exists` 
        })
    }

    persons= persons.concat(person)
    response.json(person)

})
//const PORT = process.env.PORT || 3001
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
