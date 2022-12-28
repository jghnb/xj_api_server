const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(function (req, res, next) {
    res.cc = function (err, status = 0) {
    res.send({
        status,
        message: err instanceof Error ? err.message : err,
    })
    }
    next()
})

const joi = require('joi')

const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//]}))

const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/xj', userinfoRouter)

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'TokenExpiredError') return res.cc('身份认证过期了！')
    if (err.name === 'JsonWebTokenError') return res.cc('无效token！')
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)
})

app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})