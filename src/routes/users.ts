var express = require('express')
var router = express.Router()
const usersModel = require('../models/users')
const verifyToken = require('../middleware/jwtDecode')
const ordersModel = require('../models/orders')
import { Request, Response } from 'express'

router.get('/',verifyToken, async function(req: Request, res: Response) {
  try{
    let username: String = res.locals.auth.username
    let user = await usersModel.findOne({ username: username }, { password: 0 ,__v : 0})
    
    return res.status(200).send({
      success: true,
      result: user
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

router.put('/',verifyToken, async function(req: Request, res: Response) {
  try{
    let { fullName, email, tel, gender, birthday } = req.body
    let username: String = res.locals.auth.username
    await usersModel.findOneAndUpdate({
      username: username
    }, {
      fullName,
      email,
      tel,
      gender,
      birthday: birthday ? new Date(birthday) : null
    })
    
    return res.status(200).send({
      success: true,
      result: 'edit success'
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

router.get('/orders',verifyToken, async function(req: Request, res: Response) {
  try{
    let username: String = res.locals.auth.username
    let orders = await ordersModel.find({ 'custormer.username': username }, { custormer: 0, __v: 0 })
    
    return res.status(200).send({
      success: true,
      result: orders
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

module.exports = router