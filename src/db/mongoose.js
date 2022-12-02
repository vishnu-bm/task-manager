const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/new-Task-Manager-api'
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// const user = new NewUser({
//     name: "   David   Butista   ",
//     email: "  davIId@gmail.com    ",
//     password: "password@123",
//     age: 23
// })

// user.save().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })

// const newTask = new NewTask({
//     description: "     work from home     ",
// })

// newTask.save().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })