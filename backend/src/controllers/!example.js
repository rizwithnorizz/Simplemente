
import Note from "../models/Note.js";
export async function getAllNotes(req, res){
    try{
        const notes = await Note.find();
        res.status(200).json(notes);
    }catch(error){
        console.log("Error: ", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote(req, res){
    try {
        const {title, content} = req.body;
        const newNote = new Note({title, content});

        const saved = await newNote.save();
        res.status(201).json(saved);
    }catch(error){
        console.log("Error encountered: ", error);
        res.status(500).json({message: "Error encountered"});
    }
};

export async function updateNote(req, res){
    try {
        const {title, content} = req.body;

        const updateNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, {
            new: true,
        });
        if (!updateNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json({updateNote});

    }catch(error){
        console.log("Error encountered: ", error);
        res.status(500).json({message: "Error encountered"});
    }
};

export async function deleteNote(req, res){
    try{
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json({deletedNote});
    }catch(error){
        console.log("Error encountered: ", error);
        res.status(500).json({message: "Error encountered"});
    }
};