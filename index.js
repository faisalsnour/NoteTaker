const express = require('express');
const app = express();
const fs = require('fs')

const PORT = 3000; // for Heroku ? process.env.PORT || 3000

// will share any static html files with the browser
app.use(express.static('html'));
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let savedNoteList = './.noteList.json';

let noteList = fs.existsSync(savedNoteList) ?
JSON.parse( fs.readFileSync(savedNoteList) ) : []


// function to send all notes saved when api is called
app.get('/api/notes', function (req, res) {
    res.send(noteList);
});


// function to send a specifc element by passing noteID 
app.get('/api/:id', function(req,res){
    const targetedDisplayID = req.params.id
    // console.log(`value of targetedDisplayID =  ${targetedDisplayID}`)
    // console.log("type of targetedDisplayID" + typeof(targetedDisplayID))
    
    var getIndex;

    for(i=0; i<noteList.length; i++){
        if(noteList[i].id === JSON.parse(targetedDisplayID)){
            getIndex = i;
            // console.log(`getIndex = ${getIndex}`)
        }
    }  
    // console.log(`the clicked element has index: ${JSON.stringify(noteList[getIndex])}`)

    // Clear noteList and get latest version of it 
    noteList = [];
    noteList =  JSON.parse( fs.readFileSync(savedNoteList))

    // to send it to the variable on html file 
    res.send(noteList[getIndex])
})


// to delete a note by passing noteID
app.post('/api/notes/delete', function (req, res) {
    console.log('table id req.body: ', req.body.id);
    const deleteTableId = req.body.id;
    var targetedIndex;
    for(j=0; j<noteList.length; j++){
        if(noteList[j].id === deleteTableId){
            targetedIndex = j;
        }
    }
    
    noteList.splice(targetedIndex,1)
    fs.writeFileSync( savedNoteList, JSON.stringify( noteList ) )
    
}); 

// to add new note 
app.post('/api/note/add', function(req,res){
    
    let newNote = req.body;

    console.log(`note id is ${newNote.id} 
     title is : ${newNote.noteTitle} 
     message is: ${newNote.noteText}`)

     console.log(newNote)

     noteList.push(newNote)
     fs.writeFileSync( savedNoteList, JSON.stringify( noteList ) )
})


app.listen(PORT, function () {
    console.log('http://localhost:' + PORT);
});