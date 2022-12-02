
const express = require('express')
const NewTask = require('../models/tasks.js')
const router = express.Router()


router.post("/tasks", async (req, res) => {
    const task = new NewTask(req.body)
    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await NewTask.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const updateLists = ["description", "completed"]
    const isAvailable = updates.every(update => updateLists.includes(update))
    if (!isAvailable) {
        return res.status(400).send("field not available")
    }
    try {
        const tasks = await NewTask.findById(req.params.id)
        updates.forEach(update => tasks[update] = req.body[update])
        await tasks.save()
        // const tasks = await NewTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})


router.delete('/tasks/:id', async (req, res) => {
    try {
        const tasks = await NewTask.findByIdAndDelete(req.params.id)
        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router