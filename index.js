require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.json())
app.use(express.static('build'))

morgan.token('content', req => JSON.stringify(req.body) )

app.get('/', (req, res) => {
  res.send('<h1>Moi... teille kaikille... sen kun huutelette, harmi kun en kuule sanaakaan</h1>')
})

app.get('/info', (req, res) => {

  res.send(`<p>Phonebook has info for ${persons.length} people<p>
            <p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person.find().then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (persons.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = {
    id: Math.floor(Math.random()*10000),
    name: body.name,
    number: body.number
  }

  console.log(person)
  persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})