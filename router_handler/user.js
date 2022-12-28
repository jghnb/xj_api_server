const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')


exports.register = (req, res) => {
  const userinfo = req.body
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    var salt = bcrypt.genSaltSync(10)
    userinfo.password = bcrypt.hashSync(userinfo.password, salt)

    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      res.cc('注册成功！', 200)
    })
  })
}


exports.login = (req, res) => {
  const userinfo = req.body
  const sql = `select * from ev_users where username=?`
  
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登录失败！')

    const compareResult = bcrypt.compareSync(userinfo.password, results[0].PassWord)
    if (!compareResult) return res.cc('登录失败！')
    const user = { ...results[0], PassWord: ''}
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.send({
      status: 200,
      message: '登录成功！',
      token:  'Bearer ' + tokenStr,
    })
  })
}
