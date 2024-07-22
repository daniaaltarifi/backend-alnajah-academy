const asyncHandler = require('../Middleware/asyncHandler.js');
const db=require('../config.js')

const getTag= asyncHandler(async(req,res)=>{
    const sqlSelect = 'SELECT * FROM tag'
    db.query(sqlSelect,(err,result)=>{
        if(err){
            console.error('Error selecting data: '+err.message)
            return res.json({message: 'Error'})
        }
        res.status(200).json(result)
    })
 
})
module.exports = {getTag}
