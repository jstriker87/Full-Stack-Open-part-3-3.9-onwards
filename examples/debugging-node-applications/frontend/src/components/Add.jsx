const Add= ({newName, newNumber,setNewName, setNewNumber,addPerson}) => {
const nameChange = (event) => {
    setNewName(event.target.value)
    }

 const numberChange = (event) => {
    setNewNumber(event.target.value)
    }

  return (
       <div>
      <form onSubmit={addPerson}>
        <div>
          <h2> Add a new </h2>
          name: <input value={newName} onChange={nameChange}/>
          number: <input value={newNumber} onChange={numberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}
export default Add
