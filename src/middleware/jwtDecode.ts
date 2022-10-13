const jwt = require('jsonwebtoken')
const moment = require('moment')
import { Request, Response, NextFunction } from 'express'
import { now } from 'mongoose'

module.exports = ( req: Request, res: Response, next: NextFunction ) => {
  try{
    const token = req.headers.authorization
    let spToken: String = ''
    if(token) {
      spToken = token.split('Bearer ')[1]
    } else {
      throw new Error()
    }
    const decode = jwt.verify(spToken, process.env.JWT_KEY)
    let nowDate: Date = new Date()
    let expireToken: Date = new Date(decode.expireToken)
    if(!moment(nowDate).isBefore(expireToken)) {
      throw new Error()
    }
    res.locals.auth = decode
    return next()
  } catch (error: any) {
    return res.status(400).send({
      success: false,
      message: 'Auth fail'
    })
  }
}