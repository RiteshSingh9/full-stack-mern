const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = Schema({
    task: { type: String, required: true },
    dueDate: { type: Date, default: null },
    isImportant: { type: Boolean, default: false },
    completed: { type: Boolean, default: false},
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true}
}, {
    timestamps: true
});


module.exports = mongoose.model('Todos', TodoSchema)