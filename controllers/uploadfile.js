var csv = require('csvtojson')
var fs = require('fs')
var connection = require('./connection.js')

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index')
    })


    app.post('/', function (req, res) {
        if (req.files) {
            //console.log(req.files)
            var file = req.files.filename
            var filename = file.name
            file.mv("./" + filename, function (err) {
                if (err) {
                    console.log(err)
                    res.send("error occured")
                }
                else {
                    var csvFilePath = filename
                    csv().fromFile(csvFilePath).then((jsonObj) => {
                        //console.log(jsonObj)
                        fs.unlink(filename)
                        jsonObj.forEach(function (item) {
                            var query = 'UPDATE exam SET course_id = ?, block_id = ?, room_name = ?, seat = ? , display = 1 WHERE usn=?'
                            connection.query(query, [item.course_id, item.block_id, item.room, item.seat, item.usn], function (error, result, rows, fields) { if (error) throw err; })
                        })
                        
                    })
                }
            })
        }
        res.redirect('/mail')
    })


    app.get('/mail',function(req,res){
        var query = 'select s.usn, s.name, s.email, c.course_name, b.block_name, e.room_name, e.seat from exam e, student s, block b, course c where e.display = 1 and e.usn = s.usn and e.block_id = b.block_id and e.course_id = c.course_id'
                        connection.query(query, function (err, result, field) {
                            if (err) throw err
                            //console.log(result)   
                            res.render('students', { data: result })
                        })
    })

    app.post('/mail',function(req,res){
        var transporter = require('./mail')
        var query = 'select s.name, s.email, c.course_name, b.block_name, e.room_name, e.seat from exam e, student s, block b, course c where e.display = 1 and e.usn = s.usn and e.block_id = b.block_id and e.course_id = c.course_id'
        connection.query(query, function (err, result, field) {
            if (err) throw err
            result.forEach(function(item){
                var body = 'Hello '+item.name+'! Your assigned block for todays examination is '+item.block_name+', room name is '+item.room_name+', and your seat number is '+item.seat+', all the best for your '+item.course_name+' exam!'
                let mailOptions = {
                from: '"MC-Sagar" <mc.sagar2@gmail.com>', // sender address
                to: item.email, // list of receivers
                subject: 'Hello!', // Subject line
                text: body, // plain text body
                //html: '<b>Hello world?</b>' // html body    
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error)
                }
                console.log('Message sent')
            });
            })

        })
    res.send('done!');
        

    })
}