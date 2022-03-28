import { Request, Response } from 'express';
const userModel = require('../../models/user.ts')
const taskModel = require('../../models/task.ts')

module.exports.getUsers = async( req: Request, res: Response ) => {
  const { part, search, limit } = req.query
  const skipStep = Number(limit) * Number(part)
  const userSearch = {login: { '$regex': search } }
  try {
    const [ users, isNextPage ] = await Promise.all([
      userModel.find(userSearch)
          .limit(limit)
          .skip(skipStep),
      userModel.find(userSearch)
        .skip(skipStep + Number(limit))
        .count()
        .then(res => res > 0),
    ]);
    const tasksNumber = await taskModel.aggregate([
      { $match: { isChecked: false } },
      {
        $group: {
          _id: { userId: '$userId' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          userId: '$_id.userId',
          _id: 0,
          count: '$count'
        }
      }
    ]);
    const updatedUsers = users.map( user => {
      const searchTasks = tasksNumber.find( taskInfo => taskInfo.userId === user._id.toString());
      if (searchTasks) {
        return {...user, activeTasks: searchTasks.count}
      }
      return {...user, activeTasks: 0 }
    })
    return res.status(200).send({
      updatedUsers,
      isNextPage,
    })
  } catch (err) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

module.exports.addFriend = async(req, res) => {
  const _id = req.user.id
  const { friendId } = req.body
  console.log(_id)
  try {
    const candidate = await userModel.find({ _id: _id })
    console.log(candidate)
    if (candidate.some()) {
      return res.status(202).send({ msg: 'User is already your friend'})
    }
    await userModel.updateOne(
      { _id },
      { $push: { friends: friendId },
      })
    return res.status(200).send({ msg: 'User has become your friend' })
  } catch (e) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}