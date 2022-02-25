import { Request, Response } from 'express';
import {RequestAuthedI} from '../../interfaces/RequestAuthedI';
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const userModel = require('../../models/user.ts')

module.exports.login = async( req: Request, res: Response ) => {
  const { login, password } = req.body
  try {
    const candidate = await userModel.findOne({login})
    if (!candidate) {
      return res.status(401).send({msg :`User is not registered`})
    }
    const isPassEquals = await bcrypt.compare(password, candidate.password);
    if (!isPassEquals) {
      return res.status(401).send({msg: 'Incorrect passwords'})
    }
    const token = jwt.sign({login}, process.env.ACCESS_SECRET, {expiresIn: '30d'})
    return res.send({ token })
  } catch (err) {
    return res.status(500).send({msg: 'Server doesnt work'})
  }
}

module.exports.registration = async ( req: Request, res: Response ) => {
  const { login, password } = req.body
  if (!login || !password) {
    return res
      .status(400)
      .send({ success: false, msg: 'Login or password is incorrect' });
  }
  try {
    const candidate = await userModel.findOne({ login });
    if (candidate) {
      return res.status(400).send(`User with login ${login} already exists`)
    }
    const passwordToSave = bcrypt.hashSync(password, 10)
    const user = await userModel.create({ login, password: passwordToSave });
    return res.send({user})
  } catch (err) {
    return res.status(500).send({ msg: 'Error while working with DB' });
  }
}

module.exports.test = ( req: RequestAuthedI, res: Response ) => {
  const { login } = req.user;
  return res.send({msg: `${login} here`});
}