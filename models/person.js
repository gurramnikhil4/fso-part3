const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url).then(() => {
	console.log('connected to MongoDB')
}).catch((error) => {
	console.log('error connecting to MongoDB:', error.message)
})
  
const personSchema = new mongoose.Schema({
	name:{
		type:String,
		minLength:3,
		required:true
	},
	number:{
		type:String,
		validate: {
			validator: function(n) {
				return (n.length>=8)&&((/\d{2}-\d+/.test(n))||(/\d{3}-\d+/.test(n)))
			},
			message: props => `${props.value} is not a valid "${props.path}" value`
		},
		required:true
	}
})

personSchema.set('toJSON',{
	transform: (doc, ret) => {
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	}
})

module.exports = mongoose.model('Person', personSchema)
