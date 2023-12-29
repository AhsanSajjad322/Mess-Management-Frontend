const express = require("express")
const router = express.Router()
const methodOverride = require("method-override");
const studentService = require("../services/studentService")
const adminService = require("../services/adminService")
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

router.use(methodOverride('_method'));

const storedTokenMiddleware = (req, res, next) => {
    // Retrieve the token from local storage
    const storedToken = localStorage.getItem('token');
  
    if (storedToken) {
      // If the token is present, move to the next middleware or route handler
      next();
    } else {
      // If the token is not found, redirect to the login page
      res.render('student/login.ejs');
    }
  };
  
  const validateTokenMiddleware = async (req, res, next) => {
      // Retrieve the token from local storage
      const storedToken = localStorage.getItem('token');
    
      if (!storedToken) {
        return res.status(401).json({ message: 'Token not found' });
      }
    
      try {
        // Send the token to the server for validation
        const validationResponse = await validateTokenOnServer(storedToken);
    
        if (validationResponse.valid) {
          // If the token is valid, attach the user ID to the request
          req.userId = validationResponse.userId;
          next(); // Call the next middleware or route handler
        } else {
          return res.status(401).json({ message: 'Invalid token' });
        }
      } catch (error) {
        console.error('Error validating token on server:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  };
    
    // Function to validate the token on the server
    const validateTokenOnServer = async (token) => {
      try {
        const serverResponse = await fetch('http://localhost:3000/mms/admin/validate_token_admin', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });
    
        if (!serverResponse.ok) {
          console.log("bad responce")
          return {
            valid: false,
            userId: null,
          };
          // throw new Error(`HTTP error! Status: ${serverResponse.status}`);
        }
    
        const data = await serverResponse.json();
        console.log("responce returned from server when the validate-admin route is hit : ", data);
        return {
          valid: true,
          userId: data.userId,
        };
      } catch (error) {
        console.error('Error validating token on server:', error);
        return {
          valid: false,
          userId: null,
        };
      }
  };

// Student Routes

router.get("/login", storedTokenMiddleware,(req,res)=>{
    // res.render("login.ejs");
    res.redirect('/mms/login');
})

router.get("/logout", storedTokenMiddleware, async(req,res)=>{
    await studentService.logout();
    // res.redirect('login');
    res.redirect('/mms/login');
})

// router.post("/login/validate",async (req,res)=>{
//   if (!req.body.isAdmin){
//     let username= req.body.username;
//     let password = req.body.password;
//     let credentials = {
//         "username": username,
//         "password": password
//     }
//     // ahsan2021
//     // ahsan
//     let responce = await studentService.validate(credentials);
//     console.log(responce);
//     if (responce == 'valid'){
//         const storedToken = localStorage.getItem('token');
//         console.log('Stored Token:', storedToken);
//         res.redirect('/mms/student/dashboard')
//     } else if(responce == 'invalid'){
//         res.render("student/login.ejs");
//     }
//   } else{
//     res.render("student/login.ejs");
//   }
// })

router.get("/dashboard",storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
    if (req.userId) {
      let student = await studentService.getStudentbyID(req.userId); 
      res.render('student/dashboard.ejs', {student});
    } else {
      // The token is invalid or missing, redirect to the login page
      res.redirect('login');
    }
  })

router.get("/",storedTokenMiddleware, validateTokenMiddleware, (req,res)=>{
    if (req.userId) {
      // The token is valid, render the dashboard page
      res.redirect('/mms/student/dashboard.ejs');
    } else {
      res.redirect('login');
    }  
})

router.get("/messMenu", storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let messMenu = await adminService.fetchMenu();
    res.render("student/messMenu.ejs", {messMenu});
  } else {
    res.redirect('login');
  } 
})

router.get("/editProfile", storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
  if (req.userId) {
    let student = await studentService.getStudentbyID(req.userId)
    res.render("student/editProfile.ejs", {student});
  } else {
    res.redirect('login');
  } 
})

router.put("/updateStudent/:id",storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
  if (req.userId) {
    let id = req.params.id;
    let updatedData = req.body;
    await studentService.updateStudent(id, updatedData);
    res.redirect('/mms/student/dashboard');
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

router.get("/messOff", storedTokenMiddleware, validateTokenMiddleware,(req,res)=>{ 
    if(req.userId) {
      let id = req.userId;
      res.render("student/messOff.ejs", {id});
    } else {
      // The token is invalid or missing, redirect to the login page
      res.redirect('login');
    }
})


router.post('/:id/messoff',storedTokenMiddleware, validateTokenMiddleware, async (req, res) => {
    try {
      const { day, mealtype } = req.body;
      const studentId = req.params.id;
  
      // Validate input
      if (!day || !mealtype || !studentId) {
        return res.status(400).json({ error: 'Invalid input. Both day, mealtype, and studentId are required.' });
      }
  
      // Call the service function to process the mess off request
      const result = await studentService.processMessOffRequest(studentId, day, mealtype);
      res.redirect('/mms/student/dashboard');
    } catch (error) {
      console.error('Error processing mess off request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
