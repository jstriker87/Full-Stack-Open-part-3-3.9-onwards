const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
      mongoose.connection.close()
    })
  })}

const password = process.argv[2]

const url = `mongodb+srv://jbart:${password}@fullstackopen.l4oeb.mongodb.net/personApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  })
  return person.save()
}

let regex = /^[a-zA-Z]+$/

if (regex.test(process.argv[4]) === true){
  console.log('The Phone number provided contains alpha numeric characters. If the persons name contains a space it must be entered within quoation marks')
  process.exit(1)
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

