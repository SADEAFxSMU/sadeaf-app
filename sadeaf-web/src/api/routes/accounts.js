import {Router} from "express";

const router = Router()

router.get('/accounts', function (req, res, next) {
  res.json({})
})

module.exports = router
