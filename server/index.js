const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db')

// middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create a todo 
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todo(description) VALUES ($1) RETURNING *",[description]); // HERE THE $1 IS A PLACE HOLDER WHICH WILL
    // TAKE THE VALUE FROM THE DESCRIPTION ARRAY WHICH WE PROVIDED AT THE END HERE AND IT IS A PART OF PG LIBRARY
    // AND THE RETURNIN * MEANS WHEN WE RETURNS THE RESULT HERE AS RESPONSE WHERE WE WILL GET THE ROW WE CREATED IN DB
    res.json(newTodo.rows[0]) // HERE THE ROWS[0] WILL ONLY CONTAIN THE ROW WHAT WE CREATED NOW ,MEANS IT WILL LIMIT THE RESPONSE BY SENDING THIS DATA ONLY
  } catch (error) {
    console.error(error.message)

  }
})

// get all todo`s

app.get('/todos',async(req,res)=>{
  try {
    const allTodo = await pool.query('SELECT * FROM todo');
    res.json(allTodo.rows)
  } catch (error) {
  console.error(error.message)    
  }
})
// get a todo 
app.get('/todos/:id',async(req,res)=>{
  try {
    // const oneTodo = await pool.query(`SELECT * FROM todo WHERE todo_id = ${req.params.id}`)
    const oneTodo = await pool.query('SELECT * FROM todo WHERE todo_id = $1',[req.params.id])
    res.json(oneTodo.rows)
  } catch (error) {
    console.error(error.message)
    
  }
})

// update a todo 
app.put('/todos/:id',async(req,res)=>{
  try {
  await pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2',[req.body.description ,req.params.id])
    res.json("db has been updated")
  } catch (error) {
    console.error(error.message)
      }
})
// delete a todo 
app.delete('/todos/:id',async(req,res)=>{
  try {
    await pool.query('DELETE FROM todo WHERE todo_id = $1',[req.params.id])
    res.json('row has been deleted')
  } catch (error) {
    console.error(error.message)
  }
})
app.listen(5000, () => console.log(`server has started on port http://localhost:5000`))
