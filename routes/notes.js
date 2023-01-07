const express = require('express')
const router = express.Router()
const Notes = require("../models/Notes")
const fetchuser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async(req, res) => {
    const notes = await Notes.find({ user: req.user })
    res.send(notes)
})

router.post('/addnote', fetchuser, [
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'Please enter some description of atleast 5 characters').isLength({ min: 5 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Notes({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user
        })
        const savedNote = await note.save()
        res.send(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some internal server error occured!" })
    }
})

router.put('/updatenote/:id', fetchuser, async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {


        const newNote = {}
        if (req.body.title) { newNote.title = req.body.title }
        if (req.body.description) { newNote.description = req.body.description }
        if (req.body.tag) { newNote.tag = req.body.tag }

        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).json({ error: "Not found" })
        }
        if (note.user.toString() !== req.user) {
            return res.status(401).json({ error: "Not allowed" })
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some internal server error occured" })
    }


})


router.put('/deletenote/:id', fetchuser, async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {



        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).json({ error: "Not found" })
        }
        if (note.user.toString() !== req.user) {
            return res.status(401).json({ error: "Not allowed" })
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.send({ success: "A note has been deleted succesfully", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some internal server error occured" })
    }


})

module.exports = router