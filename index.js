const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5173' }));
const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))
const mongoose = require('mongoose')
require('dotenv').config();
const url = process.env.MONGODB_URI_PERSONS;
mongoose.set('strictQuery',false)
mongoose.connect(url)
const Person = require('./models/person')

var currentDate = new Date(); 
var currentDateString = currentDate.toString();

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//app.get('/info', (request, response) => {
//    response.send(`Phonebook has info for ${persons.length} notes </br> ${currentDateString}`); 
//})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response) => {
  id = request.params.id
  Person.findById(request.params.id).then(person=>{
    response.json(person)
  })
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
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        id: generateID(),
        name: body.name,
        number:body.number,
    })

    //const duplicate = notes.find(notecheck =>notecheck.name ==note.content)
    //if (duplicate) {
    //    return response.status(400).json({ 
    //        error: `The name ${note.name} already exists` 
    //    })
    //}

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
