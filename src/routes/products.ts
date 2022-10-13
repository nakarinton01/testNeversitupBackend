var express = require('express')
var router = express.Router()
const productsModel = require('../models/products')
const mainfunction = require('../controllers/mainfuntions')
import { Request, Response } from 'express'

router.get('/', async function(req: Request, res: Response) {
  try{
    let { limit, page, min, max, rating } = req.query
    let search: any = req.query.search
    let pageAndskip = await mainfunction.limitPage(limit, page)
    
    let query = {}
    let andCond = []
    search ? Object.assign(query, { name: new RegExp(search, 'i') }) : null
    min ? andCond.push({ price: { $gte: Number(min) } }) : null
    max ? andCond.push({ price: { $lte: Number(max) } }) : null
    rating ? Object.assign(query, { rating: { $gte: Number(rating) } }) : null
    if(andCond.length) {
      Object.assign(query, { $and: andCond })
    }
    
    let products = await productsModel.aggregate([
      { $match: query },
      { $skip: pageAndskip.skip },
      { $limit: pageAndskip.limit },
      {
        $project: {
          colors: 0,
          __v: 0
        }
      },
    ])
    
    return res.status(200).send({
      success: true,
      result: products
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
    let _id = req.params._id
    let products = await productsModel.findOne({ _id: _id }, { __v : 0 })

    return res.status(200).send({
      success: true,
      result: products
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