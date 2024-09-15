import { useState, useEffect } from 'react'
import Search from './components/Search'
import Add from './components/Add'
import Phonebook from './components/Phonebook'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import personsService from './services/persons'

const App = () => {
const [persons, setPersons] = useState([])
const [newName, setNewName] = useState('')
const [newNumber, setNewNumber] = useState('')
const [filterName, setFilterName] = useState('')
const [message, setMessage] = useState(null)
const [errorMessage, setErrorMessage] = useState(null)




const deletePerson = (id) => {
    const person = persons.filter(person => person.id === id)
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
     personsService
    .deletePB(person)
    .then(response => {
        response.data
        setPersons(persons.filter(person => person.id !== id))
    })
    }

  }

useEffect(() => {
    personsService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
    name: newName,
    number: newNumber,
    id: String(persons.length + 1),
  }

    const result = persons.find(e => e.name === personObject.name);
    if (result) {
        if (window.confirm(`is already added to the phonebook. Replace the old number with a new one? ${personObject.name}?`)) {
            const changedPerson = { ...result, number: personObject.number}
            personsService
           .update(result.id,changedPerson)
            .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== result.id ? person: returnedPerson.data))
                setMessage(
                    `${personObject.name}'s number updated`
                )
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
              })
              .catch(error => {
                 setErrorMessage(
                    `Note '${personObject.name}' has already been deleted from the server`
                )
                setPersons(persons.filter(person => person.id !== changedPerson.id))
    })
        }
        return
    }
    if (personObject.name.length === 0 || personObject.number.length === 0) {
        window.alert(`Name or number has not not been entered`)
        setNewName('')
        return -1
    }
    
   personsService
   .create(personObject)
    .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')

        setMessage(
          `Note '${personObject.name}' added to server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        })
    }

  return (
    <div>
       <Notification message={message}/>
       <ErrorNotification message={errorMessage}/>
      <Search filterName={filterName} setFilterName={setFilterName} />
      <Add newName={newName} newNumber={newNumber} addPerson={addPerson} setNewName={setNewName} setNewNumber={setNewNumber}/> 
      <Phonebook persons={persons} filterName={filterName} deletePerson={deletePerson}/>
    </div>
  )
}

export default App

