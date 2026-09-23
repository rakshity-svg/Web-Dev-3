const getNoteById =(req,res)=>{
    let {id} = req.params;

    let element = notes.find(note=> note.id === Number(id))

    res.status(200).send(element)
}

const createNote = (req,res)=>{
    let {title, content} = req.body;

    let newNote = {
        id: notes.length + 1,
        title,                                                                                                                                                                                                                                                                               
        content
    }

    notes.push(newNote);
    res.status(201).send(newNote);
}