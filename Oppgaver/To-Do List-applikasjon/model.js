let tasks = 
JSON.parse(localStorage.getItem('tasks')) || [
    {id: Date.now(), taskDescription: "Clean room", done: true},
    {id: Date.now() +1, taskDescription: "Make a dinner", done: false},
];
