const joi = require('joi')
/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
*/
const id =  joi.string().guid({version: ['uuidv1','uuidv4','uuidv5']}).error(new Error('ID格式不正确!'))
const username = joi.string().alphanum().min(1).max(25).required().error(new Error('用户名格式不正确!'))
const password = joi.string().pattern(/^[\S]{6,25}$/).required().error(new Error('密码格式不正确!'))
const email = joi.string().allow('', null).email().error(new Error('邮箱格式不正确!'))
const phonenumber = joi.string().allow('', null).pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).error(new Error('手机号格式不正确!'))
const nickname = joi.string().allow('', null).error(new Error('昵称格式不正确!'))
const headportrait = joi.string().allow('', null).error(new Error('头像格式不正确!'))


exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

exports.update_userinfo_schema = {
    body: {
        id,
        username,
        email,
        phonenumber,
        nickname,
        headportrait
    },
}