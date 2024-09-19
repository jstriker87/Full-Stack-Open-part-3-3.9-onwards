import axios from 'axios'
//const baseUrl = '/api/persons'
const baseUrl = 'http://localhost:3001/api/persons';
const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const deletePB = deleteObject => {
  let url = `${baseUrl}/${deleteObject[0].id}`
  return axios.delete(url, deleteObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  deletePB: deletePB,
}
