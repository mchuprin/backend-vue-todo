import { Request, Response } from 'express';
const userModel = require('../../models/user.ts')
const taskModel = require('../../models/task.ts')
const friendModel = require('../../models/friendship.ts')

module.exports.getUsers = async( req: Request, res: Response ) => {
  const { part, search, limit } = req.query
  const skipStep = Number(limit) * Number(part)
  const userSearch = {login: { '$regex': search } }

  try {
    const [ usersDB, isNextPage ] = await Promise.all([
      userModel.find(userSearch)
          .limit(limit)
          .skip(skipStep)
          .lean(),
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

    const friends = await friendModel.aggregate([
      { $match: { friendshipStatus: true }},
      { $group: {
        _id: {
          $cond: {
            if: { senderId: '$senderId' },
            then: '$senderId',
            else: '$receiverId',
          }
        },
        count: { $sum: 1 }
      }},
      // { $project: {
      //   userId: {
      //     $cond: {
      //       if: { userId: '$_id.senderId'},
      //       then: "$_id.senderId",
      //       else: '$_id.senderId'
      //     }
      //   },
      //   _id: 0,
      //   count: '$count'
      // }}
    ])
    console.log(friends)
    const users = usersDB.map( user => {
      const activeTasksNumber = tasksNumber.find( taskInfo => taskInfo.userId === user._id.toString() );
      const friendsNumber = friends.find( friend => friend.userId === user._id.toString() )
      return {
        ...user,
        activeTasks: activeTasksNumber ? activeTasksNumber.count : 0,
        friends: friendsNumber ? friendsNumber.count : 0,
      }
    })
    return res.status(200).send({
      users,
      isNextPage,
    })
  } catch (err) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

