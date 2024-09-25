const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5173' }))
const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

var currentDate = new Date()
var currentDateString = currentDate.toString()
let persons = [
  {
    id: '2',
    name: 'Joe',
    number: '544302'
  },
  {
    id: '3',
    name: 'Amy',
    number: '544303'
  },
  {
    id: '5',
    name: 'Tony',
    number: '544305'
  }
]

app.get('/', (_, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (_, response) => {
  response.send(`Phonebook has info for ${persons.length} notes </br> ${currentDateString}`)
})

app.get('/api/persons', (_, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else{
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {

  let id = request.params.id
  persons = persons.filter(person => person.id !== id)
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

  const duplicate = persons.find(notecheck => notecheck.name === person.content)
  if (duplicate) {
    return response.status(400).json({
      error: `The name ${person.name} already exists`
    })
  }

  persons= persons.concat(person)
  response.json(person)

})
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
