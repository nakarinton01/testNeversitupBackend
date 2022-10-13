var express = require('express')
var router = express.Router()
const usersModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import { Request, Response } from 'express'

router.post('/register',async function(req: Request, res: Response) {
  try{
    let { fullName, username, password, email, tel, gender, birthday } = req.body
    
    let users = await usersModel.findOne({username: username})
    if (users) throw new Error('username is already')

    let hashPassword = await bcrypt.hash(password, 10)
    let newUsers = new usersModel({
      fullName,
      username,
      password: hashPassword,
      email,
      tel,
      gender,
      birthday: birthday ? new Date(birthday) : null,
      createdAt: new Date()
    })
    await newUsers.save()
    return res.status(200).send({
      success: true,
      result: 'register success'
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

router.post('/signin', async function(req: Request, res: Response ) {
  try{
    var { username, password } = req.body
    let users = await usersModel.findOne({username: username})
    if (!users) throw new Error('login fail')
    let checkPassword = await bcrypt.compare(password, users.password)
    if (!checkPassword) throw new Error('login fail')
    let nowDate: Date = new Date()
    let expireToken: Date = new Date(nowDate.setTime(nowDate.getTime() + 7 * 60 *60 *1000))
    
    const token = jwt.sign({_id: users._id, fullName: users.fullName, username, expireToken}, process.env.JWT_KEY)
    return res.status(200).send({
      success: true,
      result: 'login success',
      token,
      expireToken
    })

  }catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

module.exports = router