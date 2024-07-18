const express= require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config()
const db=require('./config.js')
const DepartmentRouter = require('./Router/DepartmentRouter.js')
const TeacherRouter = require('./Router/TeacherRouter.js')
const CoursesController = require('./Router/CoursesRouter.js')
const SubjectController = require('./Router/SubjectRouter.js')
const app = express();
const PORT= process.env.PORT || 3005
app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 
app.use(cookieParser())  
app.use(express.static('images'))
app.use('/department',DepartmentRouter)
app.use('/teacher',TeacherRouter)

app.use('/courses', CoursesController)
app.use('/info', SubjectController)
app.get ('/',(req,res)=>{
    res.send("Welcome to alnajah academy! ")
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})