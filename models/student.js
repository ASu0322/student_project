const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 18,
    max: [80, '太老了']
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, '太多了']
    },
    other: {
      type: Number,
      min: 0
    }
  }
})

studentSchema.plugin(uniqueValidator)

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
