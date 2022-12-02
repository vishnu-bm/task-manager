const express = require('express');
require('./db/mongoose.js')
const userRouter = require('./routes/users')
const taskRouter = require('./routes/tasks.js')

const app = express();
const port = process.env.PORT || 8000;

// app.use((req, res, next) => {
//     res.status(501).send("site under maintainance")
// })
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log("port is at server", port)
})