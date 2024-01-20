const express = require('express')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

const morgan=require('morgan')
morgan.token('dataSent', function (req, res) { return JSON.stringify(req.body) })
const logger= morgan(':method :url :status :res[content-length] - :response-time ms :dataSent')
app.use(logger)


app.get('/api/persons/', (req,res)=>{ 
  Person.find({}).then(response=>{
    res.json(response)
  })
})

app.get('/info',(req,res)=>{
  Person.find({}).then(response=>{
    res.send(`<p>Phonebook has info for ${response.length} people<br/>${new Date().toString()}</p>`)
  })
    
})

app.get('/api/persons/:id',(req,res)=>{
  Person.findById(req.params.id).then(person => {
    res.json(person)
  }).catch(()=>{
    res.status(404).end()
  })
})


app.delete(`/api/persons/:id`,(req,res)=>{
    const id=req.params.id
    persons=persons.filter(person=>person.id!=id)
    res.status(204).end()
})

app.post('/api/persons/',(req,res)=>{

    if(!req.body.name||!req.body.number){
         return res.status(400).json({ 
          error: 'content missing' 
        })      
    }

    const person = new Person({
      name:req.body.name,
      number:req.body.number,
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
console.log("server created",PORT)
}
)

