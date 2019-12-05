const express = require ('express')
const Task = require ('../models/task');
const router = new express.Router(); 
const auth = require('../middleware/auth');

router.get ('/tasks/', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send (tasks);
    } catch (e) {
        res.status(500).send(e);
        console.log (e);
    }
})

router.get ('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById (_id)
        if (!task) {
            return res.status(404).send();
        }
        res.send (task);
    } catch (e) {
        res.status(500).send(e);
        console.log (e);
    }
})

router.post('/tasks/', auth, async (req, res) => {
    const task = new Task({
        ... req.body,  //copies all properties from req
        owner: req.user._id
    });
    
    try {
        await task.save ();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e);
        console.log (e);
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys (req.body);
    const isValidUpdate = updates.every ((update) => {
        return allowedUpdates.includes (update)
    });

    if (!isValidUpdate) {
        return res.status(400).send ({error: 'Invalid updates'})
    }

    try {
        const task = await Task.findById (_id)
        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();

        if (!task) {
            return res.status(404).send();
        } 
        res.send (task);
    } catch (e) {
        res.status(400).send(e);
        console.log (e);
    }
})

router.delete ('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete (_id)
        if (!task) {
            return res.status(404).send();
        }
        res.send (task);
    } catch (e) {
        res.status(500).send(e);
        console.log (e);
    }
})

module.exports = router;