const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Student = require('./models/student')
const methodOverride = require('method-override')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

// connect to mongoDB
mongoose
  .connect(
    'mongodb+srv://stanleysu:我常用的那個@cluster0.8181ufr.mongodb.net/testDB?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Connection Failed')
    console.log(err)
  })

app.get('/', (req, res) => {
  res.send('This is homepage')
})

app.get('/students', async (req, res) => {
  try {
    let data = await Student.find()
    res.render('students.ejs', { data })
  } catch {
    res.send('Error')
  }
})

app.get('/students/insert', (req, res) => {
  res.render('studentInsert.ejs')
})

app.get('/students/:id', async (req, res) => {
  let { id } = req.params
  try {
    let data = await Student.findOne({ id })
    if (data !== null) {
      res.render('studentPage.ejs', { data })
    } else {
      res.send('Cannot find this student. Please enter a valid id.')
    }
  } catch (e) {
    res.send('Error!!')
    console.log(e)
  }
})

app.post('/students/insert', (req, res) => {
  let { id, name, age, merit, other } = req.body
  let newStudent = new Student({ id, name, age, scholarship: { merit, other } })
  newStudent
    .save()
    .then(() => {
      console.log('Student accepted')
      res.render('accept.ejs')
    })
    .catch((e) => {
      console.log('Student not accepted')
      console.log(e)
      res.render('reject.ejs')
    })
})

app.get('/students/edit/:id', async (req, res) => {
  let { id } = req.params
  try {
    let data = await Student.findOne({ id })
    if (data !== null) {
      res.render('edit.ejs', { data })
    } else {
      res.send('Cannot find student')
    }
  } catch (e) {
    console.log('Error')
    console.log(e)
  }
})

app.put('/students/edit/:id', async (req, res) => {
  let { id, name, age, merit, other } = req.body
  try {
    let d = await Student.findOneAndUpdate(
      { id },
      { id, name, age, scholarship: { merit, other } },
      { new: true, runValidators: true }
    )
    res.redirect(`/students/${id}`)
  } catch {
    res.render('reject.ejs')
  }
})

app.delete('/students/delete/:id', (req, res) => {
  let { id } = req.params
  try {
    Student.deleteOne({ id }).then(() => {
      res.send('已經刪除成功了')
    })
  } catch {
    res.send('刪除失敗')
  }
})

app.get('/*', (req, res) => {
  res.status(404)
  res.send('Not allowed')
})

app.listen(3000, () => {
  console.log('啟動成功3000')
})
