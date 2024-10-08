const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5173' }))
const morgan = require('morgan')
require('dotenv').config()

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log(url)
mongoose.set('strictQuery',false)
mongoose.connect(url)

const Note = require('./models/note')


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  let id = request.params.id
  Note.findById(id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  //const duplicate = notes.find(notecheck =>notecheck.name ==note.content)
  //if (duplicate) {
  //    return response.status(400).json({
  //        error: `The name ${note.name} already exists`
  //    })
  //}

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
