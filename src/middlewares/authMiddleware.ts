import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

module.exports = async ( req: Request, res: Response, next ) => {
  const { token } = req.headers;
  if(!token) {
    return res
      .status(401)
      .send({msg: "User is unauthorized"})
  }
  try {
    (req as any).user = await jwt.verify(token, process.env.ACCESS_SECRET)
    next()
  } catch (e) {
    return res
      .status(401)
      .send({msg: "User is unauthorized"})
  }
}