const express = require('express')

const app = express()
app.use(express.json())

const morgon=require('morgan')
const logger = morgon('tiny','immediate') 
app.use(logger)


let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons/', (req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people<br/>${new Date(8.64e15).toString()}</p>`)
})

app.get('/api/persons/:id',(req,res)=>{
    const response=persons.find(person => req.params.id ==person.id)
    if(response)res.json(response)
    else res.status(404).end()
})

app.delete(`/api/persons/:id`,(req,res)=>{
    const id=req.params.id
    persons=persons.filter(person=>person.id!=id)
    console.log(persons)
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
    console.log(persons)
    res.json(person)

})



const PORT=3001
app.listen(PORT, ()=>{
console.log("server created")
}
)

