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


app.get('/api/persons/', (req,res,next)=>{ 
	Person.find({}).then(person=>{
		if(person){
			res.json(person)
		}
		else{
			res.status(404).end()
		}
	}).catch(error => next(error))
})

app.get('/info',(req,res)=>{
	Person.find({}).then(response=>{
		res.send(`<p>Phonebook has info for ${response.length} people<br/>${new Date().toString()}</p>`)
	})
    
})

app.get('/api/persons/:id',(req,res,next)=>{
	Person.findById(req.params.id).then(person => {
		res.json(person)
	}).catch(error => next(error))
})


app.delete( `/api/persons/:id` ,(req,res,next)=>{
	console.log(req.params.id)
	Person.findByIdAndDelete(req.params.id)
		.then((response)=>{
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons/',(req,res,next)=>{
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
	}).catch(error => next(error))

})

app.put('/api/persons/:id',(req,res,next)=>{
	const personBody=req.body

	const person={
		'name':personBody.name,
		'number':personBody.number
	}
//can also give req.body instead of person
	Person.findByIdAndUpdate(req.params.id, person, { new: true,runValidators: true, context:'query' })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))

})

const errorHandler = (err,req,res,next)=>{
	console.log(err.message)
	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'ValidationError') {   
		return res.status(400).json({ error: err.message })
	}

	next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
	console.log('server created',PORT)
}
)

