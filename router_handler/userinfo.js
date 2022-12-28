const db = require('../db/index')

exports.getUserInfo = (req, res) => {
    const sql = `select username, nickname, phonenumber, email, headportrait from ev_users where id=?`
    db.query(sql, req.user.Id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        res.send({
            status: 200,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })   
}

exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set username=?,nickname=?,phonenumber=?,email=?,headportrait=? where id=?`
    db.query(sql, [req.body.username,req.body.nickname, req.body.phonenumber,req.body.email,req.body.headportrait, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        return res.cc('修改用户基本信息成功！', 200)
    })
}