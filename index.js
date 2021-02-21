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



// let noteList = [{ id:0, noteTitle: 'Go to the store', noteText: 'I need to go there and do something' }, {id:5, noteTitle: 'Go to the bank', noteText: 'Request a new cheque book' }, {id:2, noteTitle: 'Go to the doctor', noteText: 'Need to get checkup your blood pressure' }, {id:8, noteTitle: 'Go to visit Grandma', noteText: 'Go to the hospital and visit your grandmother' }];

let noteList = fs.existsSync(savedNoteList) ?
JSON.parse( fs.readFileSync(savedNoteList) ) : []

console.log(noteList)

app.get('/api/notes', function (req, res) {
    res.send(noteList);
});


var getIndex;
// review this tomorrow and fix it, just run it becuse I am close to fix it
app.get('/api/:id', function(req,res){
    const targetedDisplayID = req.params.id
    console.log(`value of targetedDisplayID =  ${targetedDisplayID}`)
    console.log("type of targetedDisplayID" + typeof(targetedDisplayID))
    
    for(i=0; i<noteList.length; i++){
        if(noteList[i].id === JSON.parse(targetedDisplayID)){
        //  if(noteList[i].id === targetedDisplayID){
            console.log("found it")
            console.log(`i = ${i}`)
            getIndex = i;
            console.log(`getIndex = ${getIndex}`)
            // to send it to the variable on html file 
        }
    }  
    console.log(`the clicked element has index: ${JSON.stringify(noteList[getIndex])}`)

    // NA clear noteList and get a new version of it 
    noteList = [];
    noteList =  JSON.parse( fs.readFileSync(savedNoteList))

    // to send it to the variable on html file 
    res.send(noteList[getIndex])
    //console.log(noteList[1])
})

app.post('/api/notes/delete', function (req, res) {
    console.log('table id req.body: ', req.body.id);
    const deleteTableId = req.body.id;
    var targetedIndex;
    for(j=0; j<noteList.length; j++){
        if(noteList[j].id === deleteTableId){
            targetedIndex = j;
        }
    }
    // add this now
    // const newNoteData =  noteList.splice(deleteTableId,1)
    noteList.splice(targetedIndex,1)
    fs.writeFileSync( savedNoteList, JSON.stringify( noteList ) )
    // add this now, to clear the existing data
    // noteList = []
    // add this now,
    // noteList = newNoteData
    // add this now
    // fs.writeFileSync( noteList, JSON.stringify( noteList ) )
    console.log(noteList)
    // const newTableData = req.body;
    // tableList.push(newTableData)
    // console.log(tableList)
    // res.send({message: `done`})
}); // end of post api/notes/delete

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