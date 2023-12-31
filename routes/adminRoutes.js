const express = require("express")
const router = express.Router()
const adminService = require("../services/adminService")
const methodOverride = require("method-override");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

router.use(methodOverride('_method'));

// Admin Routes

const storedTokenMiddleware = (req, res, next) => {
  // Retrieve the token from local storage
  const storedToken = localStorage.getItem('token');

  if (storedToken) {
    // If the token is present, move to the next middleware or route handler
    next();
  } else {
    // If the token is not found, redirect to the login page
    res.redirect('/mms/login');
    
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


router.get("/login", storedTokenMiddleware, (req,res)=>{
    console.log('in login  ')
    // res.render("login");
    res.redirect('/mms/login');
})
router.get("/logout", async(req,res)=>{
  await adminService.logout();
  res.redirect('/mms/login');
})

router.get("/",storedTokenMiddleware, validateTokenMiddleware, (req,res)=>{
  if (req.userId) {
    // The token is valid, render the dashboard page
    res.redirect('/mms/admin/dashboard.ejs');
  } else {
    res.redirect('login');
  }  
})

router.get("/dashboard",storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
  if (req.userId) {
    console.log("hererer")
    /*
      Call a service function which gives the students that have mess off for today
      */ 
    let messOffStudents = await adminService.getMessOffStudents();
    let admin = await adminService.getAdminbyID(req.userId);
    let students = await adminService.fetchStudents()
    let noOfStudents = students.length;
    // console.log("*******************************************")
    // // console.log(messOffStudents[0].lunch.length);
    // console.log(messOffStudents)
    let date = new Date();
    let monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    let currentMonthName = monthNames[date.getMonth()];
    res.render('admin/dashboard.ejs', {admin, noOfStudents, messOffStudents, currentMonthName});
  } else {
    // The token is invalid or missing, redirect to the login page
    console.log('redirect to login  ')
    res.redirect('login');
  }
})

// Get all students
router.get("/students",storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
    if (req.userId) {
      let data = await adminService.fetchStudents();
      res.render("admin/students.ejs",{data});
    } else {
      // The token is invalid or missing, redirect to the login page
      res.redirect('login');
    }
})

// Add Student
router.get("/addStudent",storedTokenMiddleware, validateTokenMiddleware, (req,res)=>{
  if (req.userId) {
    res.render("admin/addStudent.ejs");
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

router.get("/addStudentService", validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let data = req.query;
    await adminService.submitStudent(data);
    res.redirect("students");
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

router.get("/editProfile",storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let id = req.userId;
    let admin  = await adminService.getAdminbyID(id);
    res.render("admin/editProfile.ejs", {admin});
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

// Admin Update Route
// --------------------- This need to be implemented at the service function level 
// -------------- because how to track admin id
router.put("/updateAdmin/:id",storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
    if (req.userId) {
      let id = req.params.id;
      let updatedData = req.body;
      await adminService.updateAdmin(id, updatedData);
      res.redirect('/mms/admin/dashboard');
    } else {
      // The token is invalid or missing, redirect to the login page
      res.redirect('login');
    }
})

// Student Delete Route 
router.delete("/student/:id", storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let id = req.params.id;
    await adminService.deleteStudent(id);
    let data = await adminService.fetchStudents();
    res.render("admin/students.ejs",{data});  
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

// Student Update Route
router.get("/student/:id", storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let id = req.params.id;
    let student = await adminService.getStudentById(id);
    res.render('admin/updateStudent.ejs',{student}); 
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})
router.put('/updateStudent/:id', storedTokenMiddleware, validateTokenMiddleware, async (req,res)=>{
  if (req.userId) {
    let id = req.params.id;
    let updatedData = req.body;
    await adminService.updateStudent(id,updatedData);
    res.redirect('/mms/admin/students');
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

// ------------- Mess Menu Routes ----------------------

// Get mess menu
router.get('/messMenu', storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let messMenu = await adminService.fetchMenu();
    res.render("admin/messMenu.ejs", {messMenu});
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

// Get mess stats
router.get('/messStats', storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    // let messMenu = await adminService.fetchMenu();
    res.render("admin/messStats.ejs");
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

router.get("/editMenu", storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let messMenu = await adminService.fetchMenu();
    res.render("admin/editMenu.ejs", {messMenu});
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})

router.post("/updateMenu/:id", storedTokenMiddleware, validateTokenMiddleware, async(req,res)=>{
  if (req.userId) {
    let id = req.params.id;
    let updatedData = req.body;
    let updatedMenu = await adminService.updateMenu(id, updatedData); 
    res.redirect('/mms/admin/messMenu');
  } else {
    // The token is invalid or missing, redirect to the login page
    res.redirect('login');
  }
})
module.exports = router;
