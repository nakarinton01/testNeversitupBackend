var express = require('express')
var router = express.Router()
const productsModel = require('../models/products')
const ordersModel = require('../models/orders')
const mainfunction = require('../controllers/mainfuntions')
const verifyToken = require('../middleware/jwtDecode')
import { Request, Response } from 'express'

router.post('/', verifyToken, async function(req: Request, res: Response) {
  try{
    let orders: any = req.body.orders
    if(orders.length) {
      let productsId: String[] = []
      orders.map((a:any) => {
        productsId.push(a._id)
      })
      let product = await productsModel.find({ _id: { $in: productsId } })
      let newOrders: any[] = []
      for(let item of orders) {
        let findProduct = product.findIndex((a:any) => a._id.toString() === item._id.toString())
        if(product[findProduct].amount <= 0) throw new Error('out of stock')
        if(findProduct !== -1) {
          newOrders.push({
            products: {
              _id: product[findProduct]._id,
              name: product[findProduct].name,
              price: product[findProduct].price,
              amount: item.amount,
              colors: item.colors,
              picture: product[findProduct].picture,
              description: product[findProduct].description,
              rating : product[findProduct].rating,
            },
            custormer: {
              _id: res.locals.auth._id,
              username: res.locals.auth.username,
            },
            status: 'active',
            createdAt: new Date()
          })
          product[findProduct].amount -= item.amount
          product[findProduct].colors.map((a:any) => {
            item.colors.map((b:any) => { a.color === b.color ? a.amount -= b.amount : null })
          })
          
        }
      }
      await ordersModel.insertMany(newOrders)
      for(let item of product) {
        await productsModel.findOneAndUpdate({
          _id: item._id
        }, {
          amount: item.amount,
          colors: item.colors,
        })
      }
    }
    
    return res.status(200).send({
      success: true,
      result: 'purchase success'
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

router.post('/cancel/:_id', verifyToken, async function(req: Request, res: Response) {
  try{
    let _id: any = req.params._id
    let orders = await ordersModel.findOne({ _id: _id, status: 'active' })
    if(orders) {
      let products = await productsModel.findOne({ _id: orders.products._id })
      products.amount += orders.products.amount
      products.colors.map((a:any) => {
        orders.products.colors.map((b:any) => {
          a.color === b.color ? a.amount += b.amount : null 
        })
      })
      await ordersModel.findOneAndUpdate({ _id: _id }, { status: 'cancel' })
      await products.save()
    }

    return res.status(200).send({
      success: true,
      result: 'cancel success'
    })
  } catch (error: any) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
})

router.get('/:_id', async function(req: Request, res: Response) {
  try{
    let _id: any = req.params._id
    let orders = await ordersModel.findOne({ _id: _id }, { custormer: 0, __v: 0 })

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