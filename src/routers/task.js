const Task = require('../models/task')
const express = require('express')
const router = new express.Router()

router.get('/tasks', async (req,res) => {
    try {
        const task = await Task.find({})
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id
   try {
       const task = await Task.findById(_id)
       res.send(task)
   } catch (error) {
       res.status(500).send()
   }
})

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValid = updates.every(update => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "Invalid argument!" })
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router