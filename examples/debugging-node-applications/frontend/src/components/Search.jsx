const Search= ({filterName,setFilterName}) => {
    const filterChange = (event) => {
        setFilterName(event.target.value)
    }
  return (
    <div>
    filter shown with : <input value={filterName} onChange={filterChange}/>
    </div>
  )
}
export default Search
