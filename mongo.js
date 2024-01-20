const mongoose = require('mongoose')

const password = process.argv[2]
    const url =`mongodb+srv://fullstackopen:${password}@cluster0.prm9m4i.mongodb.net/phonebook?retryWrites=true&w=majority`

    mongoose.set('strictQuery',false)
    mongoose.connect(url)


    const personSchema = new mongoose.Schema({
        name:String,
        number:String,
    })

    const Person = mongoose.model('Person',personSchema)


if(process.argv.length == 3){
    Person.find({}).then(result => {
       console.log("phonebook:")
        for(const doc of result){
            console.log(doc.name, doc.number)
        }
       mongoose.connection.close()
      })
}

else if (process.argv.length == 5){
    const name = process.argv[3]
    const number=process.argv[4]
    const person= new Person(
        {
            name:name,
            number:number,
        }
    )
    person.save().then(
        result=>{
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        }
    )
}
