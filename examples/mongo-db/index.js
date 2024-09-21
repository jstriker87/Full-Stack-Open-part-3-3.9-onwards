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

var currentDate = new Date(); 
var currentDateString = currentDate.toString();
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
    response.send(`Phonebook has info for ${notes.length} notes </br> ${currentDateString}`); 
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  id = request.params.id
  const note = notes.find(note=>note.id ==id)
  if (note) {
    response.json(note)
  } else{
        response.status(404).end()
  }

})

app.delete('/api/notes/:id', (request, response) => {

    id = request.params.id
    notes = notes.filter(note=>note.id != id)
    response.status(204).end()

})

const generateID = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id))) 
        : 0
    return String(maxId + 1)
}


app.post('/api/notes', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body) {
        return response.status(400).json({ 
            error: 'The name or number are missing' 
        })
    }


    const note = {
        id: generateID(),
        content: body.content,
        important:body.important,
    }

    const duplicate = notes.find(notecheck =>notecheck.name ==note.content)
    if (duplicate) {
        return response.status(400).json({ 
            error: `The name ${note.name} already exists` 
        })
    }

    notes = notes.concat(note)
    response.json(note)

})
const PORT = process.env.PORT || 3001
//const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
