const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const studentService = require("./services/studentService")
const adminService = require("./services/adminService")
const adminRoutes = require("./routes/adminRoutes")
const studentRoutes = require("./routes/studentRoutes")
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const PORT = process.env.PORT || 3001;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.use("/mms/admin",adminRoutes)
app.use("/mms/student",studentRoutes)

app.get("/",(req,res)=>{
    res.redirect('/mms/login');
})

app.get("/mms",(req,res)=>{
    res.redirect('/mms/login');
})

app.get('/mms/login',(req,res)=>{
    res.render('login');
})

app.post('/mms/login/validate',async(req,res)=>{
    let username= req.body.username;
    let password = req.body.password;
    let credentials = {
        "username": username,
        "password": password
    }
    if (req.body.isAdmin == 'on'){
        // john_doe123
        // securePassword
        let responce = await adminService.validate(credentials);
        console.log(responce);
        if (responce == 'valid'){
            const storedToken = localStorage.getItem('token');
            console.log('Stored Token:', storedToken);
            res.redirect('/mms/admin/dashboard')
        } else if(responce == 'invalid'){
            res.redirect('/mms/login');
        }
    } else{
        // ahsan2021
        // ahsan
        let responce = await studentService.validate(credentials);
        console.log(responce);
        if (responce == 'valid'){
            const storedToken = localStorage.getItem('token');
            console.log('Stored Token:', storedToken);
            res.redirect('/mms/student/dashboard')
        } else if(responce == 'invalid'){
            res.redirect('/mms/login');
        }
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
