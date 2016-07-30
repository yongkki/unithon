var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router = express.Router();

var connection = mysql.createConnection({
  'host' : 'test.c1bxpnczadfg.us-west-2.rds.amazonaws.com',
  'port' : '3307',
  'user' : 'admin',
  'password' : '12341234',
  'database' : 'test'
});


var _storage = multer.diskStorage({
    destination: function(req, file, cb){   //디렉토리 위치
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){  //파일명
        cb(null, Date.now() + "." + file.originalname.split('.').pop());
    }
});


var upload = multer({ storage: _storage });

router.post('/test', upload.single('userPhoto'), function(req, res, next){
  var filename = req_up.file.filename;
  var path = req_up.file.path;
  console.log(filename);
  console.log(path);
  res.status(200).json({result : filename});
})
/* GET home page. */
router.post('/up', upload.single('userPhoto'),function(req, res, next) {
  var filename = req_up.file.filename;
  var path = req_up.file.path;
  console.log(path);
  connection.query('insert into user(name, email, password, picture_id) values(?,?,?,?);', [req.body.name, req.body.email, req.body.password, filename], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({email : req.body.email});
    }
  });

});


router.get('/duplitcation', function(req, res, next){
  connection.query('select * from user where email = ?', [req.query.email], function(error, cursor){
    console.log()
    if (error){
      res.status(500).json({error : error});
    }
    else {
      if (cursor.length > 0)
        res.status(200).json({result : false});
      else
        res.status(200).json({result : true});
    }
  });
});

module.exports = router;
