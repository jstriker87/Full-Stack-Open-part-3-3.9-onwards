const Phonebook = ({persons, filterName,deletePerson}) => {
  return (
  <div>
    <h2> Numbers </h2>
        <ul>
        {persons
            .filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
            .map(person => (
                <p key={person.name}>
                    {person.name} {person.number}
                     <button onClick={() => deletePerson(person.id)}>Delete</button>
                </p>
        ))}
        </ul>
    </div>
  )
}
export default Phonebook
