const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5174' }));
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

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  id = request.params.id
  Person.findById(request.params.id).then(person=>{
    response.json(person)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
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
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
