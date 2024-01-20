const express = require('express')
require('dotenv').config()
const Note = require('./models/person')

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
  Note.find({}).then(response=>{
    res.json(response)
  })
})

app.get('/info',(req,res)=>{
  Note.find({}).then(response=>{
    res.send(`<p>Phonebook has info for ${response.length} people<br/>${new Date().toString()}</p>`)
  })
    
})

app.get('/api/persons/:id',(req,res)=>{
  Note.findById(req.params.id).then(note => {
    res.json(note)
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

    if(persons.find(person=>{return person.name.toLowerCase()==req.body.name.toLowerCase()})){
        return res.status(400).json({ 
           error: 'name must be unique' 
         })        
   }

    const id=Math.floor(Math.random()*1000)
    const person={...req.body, id}
    persons=persons.concat(person)
    res.json(person)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
console.log("server created",PORT)
}
)

