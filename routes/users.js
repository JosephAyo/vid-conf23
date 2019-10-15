let express = require('express');
let router = express.Router();
const User = require('../models/user');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/', function (req, res, next) {
    User.find({})
        .then(function (results) {
            if(results.length>0){
                const response ={
                    users: results.map(
                        result=>{
                            return {
                                confirmation: 'success',
                                data: result,
                                request: {
                                    method: 'GET',
                                    url: `http://localhost:3000/user/${result._id}`
                                }
                            };                        
                        }
                    )
                };
                res.status(200).json(response);
            }else {
                res.status(404).json({
                    message: 'NO ENTRIES FOUND'
                });
            }
        })
        .catch(function (err) {
            res.json({
                confirmation: 'failed',
                message: (`this error occurred from get all: ${err.message}`)
            });
        });
});

module.exports = router;
