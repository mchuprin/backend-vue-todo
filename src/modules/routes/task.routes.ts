export {};

const express = require('express')
const router = express.Router()

const {
  getTasks,
  addTask,
  deleteTask,
  editTask,
  changeOrder,
} = require ('../controllers/task.controllers')

router.get('/my', getTasks)
router.post('', addTask);
router.delete('/:userId', deleteTask);
router.patch('/editTask/:taskId', editTask);
router.patch('/changeOrder', changeOrder)

module.exports = router;
