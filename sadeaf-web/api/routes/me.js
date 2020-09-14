import {Router} from "express";

const router = Router()

router.get('/api/me', function (req, res, next) {
  // TODO(fuxing): Save Data Into Hasura if don't already exists
  const user = res.locals.user
  res.json({user})
})


module.exports = router
