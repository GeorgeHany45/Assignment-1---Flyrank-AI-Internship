const express = require ('express')

const app = express()

// tasks array
const tasks = [
    {
        id: 1,
        title: "Complete Node.js assignment",
        done: false
    },
    {
        id: 2,
        title: "Study Express routing",
        done: true
    },
    {
        id: 3,
        title: "Push project to GitHub",
        done: false
    }
];

app.use(express.json())
// server routes
app.get('/', (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({
        status : 'ok'
    });
});

//task routes
app.get('/tasks', (req,res)=>{ 
    res.status(200).json(tasks)
})

app.get('/tasks/:id', (req,res)=>{ 
    const taskid = Number(req.params.id)
    const taskrequired = tasks.find((t)=>t.id === taskid)
    if(taskrequired){
        res.status(200).json(taskrequired)
    }
    else{
        res.status(404).json({error : `task ${taskid} is not found`})
    }
})

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    // Create the new task
    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };

    // Add it to the array
    tasks.push(newTask);

    // Return the created task
    res.status(201).json(newTask);
});


app.listen ( 3000 , ()=>{
    console.log('listening on port 3000')
})