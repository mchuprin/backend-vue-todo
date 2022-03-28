import { Request, Response } from 'express';
const taskModel = require('../../models/task.ts')

module.exports.getTasks = async( req, res: Response ) => {
  try {
    const userTasks = await taskModel.find({ userId: req.user.id })
    return res.status(200).send(userTasks)
  } catch (e) {
    return res.status(500).send({msg: 'Internal server error'})
  }
}
module.exports.addTask = async( req, res: Response ) => {
  const { title, order } = req.body
  try {
    const userTask = await taskModel.create({
      userId: req.user.id,
      title,
      order,
    })
    return res.status(200).send(userTask)
  } catch (e) {
    return res.status(500).send({msg: 'Internal server error'})
  }
}

module.exports.deleteTask = async ( req, res: Response ) => {
  const _id = req.params.userId
  try {
    if (_id !== 'null') {
      await taskModel.deleteOne({ _id })
      return res.status(200).send({ msg:'Task was succesfully deleted' })
    }
    await taskModel.deleteMany({ userId: req.user.id, isChecked: true })
    return res.status(200).send({ msg:'Task was succesfully deleted' })
  } catch (e) {
    return res.status(500).send({ msg: 'Internal server error'} )
  }
}

module.exports.editTask = async (req, res) => {
  const { taskId } = req.params;
  const body = req.body;
  const { title, isChecked } = body;

  const $set = {
    ...isChecked !== undefined && { isChecked },
    ...title && { title },
  }

  try {
    await taskModel.updateOne({ _id: taskId }, { $set: $set });
    return res.status(200).send({ msg: 'Task updated' })
  } catch (err) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

module.exports.changeOrder = async (req, res) => {
  const {taskToId, taskFromId} = req.body
  const updating = async ( _id: string, newValue: any) => {
    await taskModel.updateOne({ _id }, {
      $set: {
        order: newValue
      }
    })
  }
  try {
    const [taskFrom, taskTo] = await Promise.all([
      taskModel.findOne({ _id: taskFromId }),
      taskModel.findOne({ _id: taskToId }),
    ])

    await Promise.all([
        updating(taskFrom._id, taskTo.order),
        updating(taskTo._id, taskFrom.order),
      ]);
    return res.status(200).send({ msg: 'Task updated' })
  } catch (e) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}