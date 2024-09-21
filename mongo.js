const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jbart:${password}@fullstackopen.l4oeb.mongodb.net/personApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (content, important) => {
  const person = new Person({
    content,
    important,
  })
  return person.save()
}

addPerson(process.argv[3], process.argv[4]).then(result => {
    console.log(result)
})


Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

