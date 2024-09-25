const express = require('express')
const app = express()
//app.use(express.json())
//app.use(express.static('dist'))
const cors = require('cors')
app.use(cors({ origin: '*' }));
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


app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.send(`Phonebook has info for ${count} notes </br> ${currentDateString}`); 
    })
})


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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body)
  const person = {
    name: body.name,
    number: body.number,
  }

  //Person.findByIdAndUpdate(request.params.id,person, { new: true })
    Person.findByIdAndUpdate(
        request.params.id,person, 
        { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).send({ error: 'malformatted information sent' });
    }
     Person.find({name: body.name})
    .then(result => {
    if (result.length > 1) {
        return response.status(400).send()
     }})
    .catch(error => next(error))
    const person = new Person({
        name: body.name,
        number:body.number,
    })
    person.save().then(savedperson => {
        response.json(savedperson)
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
