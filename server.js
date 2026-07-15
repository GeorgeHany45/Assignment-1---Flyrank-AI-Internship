const express = require ('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
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

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: 'A simple CRUD API for managing tasks'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./server.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns the list of all tasks.
 *     responses:
 *       200:
 *         description: A list of tasks.
 */
app.get('/tasks', (req,res)=>{ 
    res.status(200).json(tasks)
})
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns a single task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task found.
 *       404:
 *         description: Task not found.
 */
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
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task with the provided title.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       400:
 *         description: Invalid request.
 */
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
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates the title and done status of a task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Task not found.
 */
app.put('/tasks/:id', (req, res) => {
    const updateTaskId = Number(req.params.id);
    const { title, done } = req.body;

    const task = tasks.find(t => t.id === updateTaskId);

    if (!task) {
        return res.status(404).json({
            error: `Task ${updateTaskId} not found`
        });
    }

    if (!title || title.trim().length === 0) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    task.title = title;
    task.done = done;

    res.status(200).json(task);
});
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 */
app.delete('/tasks/:id', (req, res) => {
    const taskDeleteId = Number(req.params.id);

    // Find the task
    const task = tasks.find(t => t.id === taskDeleteId);

    // Task doesn't exist
    if (!task) {
        return res.status(404).json({
            error: `Task ${taskDeleteId} not found`
        });
    }

    // Find its index in the array
    const index = tasks.findIndex(t => t.id === taskDeleteId);

    // Remove it
    tasks.splice(index, 1);

    // Success (No Content)
    res.sendStatus(204);
});

app.listen ( 3000 , ()=>{
    console.log('listening on port 3000')
})