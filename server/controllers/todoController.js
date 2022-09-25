const createError = require('http-errors');
const User = require('../models/User.model');
const Todo = require('../models/Todo.model');
const mongoose = require('mongoose');

/**
 * 
 * Get All todos of a user 
 * use 'UserId' to find the todos of a user 
 * data sent will be { task, dueDate, completed, isImportant, todoId, userId }
 * 
 * GET -->  /api/todo/:todoId
 */
exports.getAllTodos = async (req, res, next) => {
    const uid = req.params.userId;
    
    Todo.find({ userId: uid}, 'userId task dueDate isImportant completed').then((todos) => {
        return res.json(todos)
    }).catch((err) => {
        // console.log(`Error: ${err.name} : ${err.message}`)
        if( err.name === 'CastError' ) {
            // invalid user ID  is given
            return res.json({
                status: 'error',
                message: 'Invalid user ID !'
            })
        } else {
            return next(createError(400))
        }
    })
}

/**
 * GET a specific todo of a user
 * user 'UserId' and 'todoId' to find the todo
 * 
 * data sent will be { task, dueDate, completed, isImportant, todoId, userId }
 * 
 * GET --> /api/todos/:userId/:todoId
 */
exports.getOneTodo = async (req, res, next) => {
    const userId = req.params.userId;
    const todoId = req.params.todoId;
    await Todo.findOne({ _id: todoId, userId: userId  }, 'userId task dueDate isImportant completed updatedAt').then((todo) => {
        res.json(todo);
    }).catch((err) => {
        if( err.name === 'CastError' ) {
            // invalid user ID  is given
            console.log(err.message)
            return res.json({
                status: 'error',
                message: 'Invalid parameted provided '
            })
        } else {
            return next(createError(400))
        }
    })
    res.end();
}

/**
 * Todo :-
 * Add todo of a user 
 * userId :- id refrence of the user || required
 * task* :- string || required
 * dueDate: date || default |null | not required
 * isImportant: boolean || default false || not required
 * 
 * POST --> /api/todo/add
 */
exports.addTodo = async (req, res, next) => {

    // if userId is not given
    if( req.body.userId === undefined ) { 
        return res.json({
            status: 'error',
            message: 'User Id is not given !'
        })
    }

    // if task description is not given
    if (req.body.task === undefined) {
        console.log('adding dse')
        return res.json({
            status: 'error',
            message: 'Task cannot be empty'
        })
    }

    const { task, dueDate, important, userId } = req.body;
    const todo = new Todo({
        task,
        userId,
        dueDate: dueDate ? dueDate : null,
        isImportant: important ? true : false,
        completed: false
    })

    await todo.save().then((data) => {
        return res.json({
            status: 'ok',
            data: {
                task: data.task,
                dueDate: data.dueDate,
                isImportant: data.isImportant,
                completed: false
            }
        })
    }).catch((err) => {
        return next(createError(500))
    })
    res.end();
}

/**
 * Mark completed Todos
 * update the status of completion of task
 * PATCH  /api/todos/mark_complete/:todoId
 * 
 */
exports.mark_completed = async (req, res, next) => {
    const todoId = req.params.todoId;
    const isCompleted = req.body.completed;
    if( isCompleted === undefined ) {
        return res.json({
            status: 'error',
            message: 'Task completion status must be "True or False"'
        })
    }
    
    await Todo.updateOne({ _id: todoId }, { completed: isCompleted }).then((result) => {
        return res.json({
            status: 'ok',
            data: {
                id: todoId,
                message: 'Task completion status has been updated successfully!'
            }
        })
    }).catch((err) => {
        if (err.name === 'CastError') {
            return res.json({
                status: 'error',
                message: 'Invalid id provided'
            })
        }
        return next(createError(500))
    })
}

/**
 * Update the todo values
 * PUT /api/todo/:todoId
 */
exports.updateTodos = async (req, res, next) => {
    const todoId = req.params.todoId; // insert values that are need to be updated
    let fieldsToUpdate = {};
    
    const { task, dueDate, important } = req.body;
    if( task !== undefined ) {
        fieldsToUpdate.task = task;
    } 
    if( important !== undefined ) {
        fieldsToUpdate.isImportant = important;
    }
    if(dueDate !== undefined) {
        // check if given value is valid date
        // console.log('checking')
        fieldsToUpdate.dueDate = dueDate;
    }

    if ( Object.keys( fieldsToUpdate ).length === 0 ) {
        return res.json({
            status: 'error',
            message: 'No value to update has been specificed !'
        })
    }

    await Todo.updateOne({ _id: todoId }, fieldsToUpdate ).then((result) => {
        return res.json({
            status: 'ok',
            data: {
                id: todoId,
                message: 'Task Update Successfully'
            }
        })
    }).catch((err) => {
        if (err.name === 'CastError') {
            return res.json({
                status: 'error',
                message: 'Invalid data or invalaid todoId !'
            })
        } 
        return next(createError(500))
    })
    res.end();
}

exports.deleteTodo = async (req, res, next) => {
    const todoId = req.params.todoId;
    await Todo.deleteOne({ _id: todoId}).then((result) => {
        return res.json({
            status: 'ok',
            data: {
                message: `${todoId} has been deleted`
            }
        })
    }).catch((err) => {
        if(err.name === 'CastError') {
            return res.json({
                status: 'error',
                message: 'Invalid todoId provided'
            })
        }
        console.log(err.message)
    })
    res.end()
} 