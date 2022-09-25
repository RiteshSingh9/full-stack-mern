const router = require('express').Router();
const { getAllTodos, addTodo, getOneTodo, mark_completed, updateTodos, deleteTodo } = require('../../controllers/todoController')

/**
 * /api/todo/userId -> get all todos of a user 
 */
router.get('/:userId', getAllTodos);
router.get('/:userId/:todoId', getOneTodo);
router.post('/add', addTodo)
router.patch('/mark_completed/:todoId',  mark_completed);
router.put('/:todoId', updateTodos);
router.delete('/:todoId', deleteTodo);


module.exports = router;