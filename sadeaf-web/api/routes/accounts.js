import {Router} from "express";

const router = Router()

router.get('/api/accounts/authenticated', function (req, res, next) {
  const user = res.locals.user
  // TODO(fuxing): Save Data Into Hasura
  res.json({user})
})

module.exports = router
