const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');


  async function validate(credentials) {
    try{
      console.log("Working")
      const response = await fetch('http://localhost:3000/mms/admin/login-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        return 'invalid'; 
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return 'valid';
    } catch(error){
      console.error('Error:', error);
    }
  }

  async function logout() {
    try {
      const storedToken = localStorage.getItem('token');
      console.log("my token : ", storedToken);
  
      // Make a POST request to the server's logout route
      const response = await fetch('http://localhost:3000/mms/admin/logout-admin', {
        method: 'POST',
        headers: {
          'Authorization': storedToken,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Clear the token from local storage
      localStorage.removeItem('token');
  
      return ;
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle errors as needed
    }
  }
  

  async function fetchStudents() {
    try {
      const response = await fetch('http://localhost:3000/mms/student/students');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data:', data);
      return data;

      // Now you can use the 'data' variable as needed.
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function getAdminbyID(id){
    try{
      const response = await fetch(`http://localhost:3000/mms/admin/admins/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data:', data);
      return data;

    } catch(error){
      console.error("Error: ",error);
    }
  }

  async function submitStudent(studentData) {
    try{
      const response = await fetch('http://localhost:3000/mms/admin/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
    } catch(error){
      console.error('Error:', error);
    }
  }

  async function deleteStudent(id){
    try{
      const responce = fetch(`http://localhost:3000/mms/admin/students/${id}`,{
        method: "DELETE",
      });
    } catch(error){
      console.error("Error: ",error);
    }
  } 


  async function getStudentById(id){
    try{
      const response = await fetch(`http://localhost:3000/mms/admin/students/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data:', data);
      return data;

    } catch(error){
      console.error("Error: ",error);
    }
  }

  async function updateStudent(id,updatedData){
    try{
      const response = await fetch(`http://localhost:3000/mms/admin/students/${id}`,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data:', data);
      return data;

    } catch(error){
      console.error("Error: ",error);
    }
  }

  async function updateAdmin(id, updatedData){
    try{
      const response = await fetch(`http://localhost:3000/mms/admin/admins/${id}`,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data:', data);
      return data;

    } catch(error){
      console.error("Error: ",error);
    }
  }


  async function fetchMenu() {
    try {
      const response = await fetch('http://localhost:3000/mms/admin/messmenu');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;

      // Now you can use the 'data' variable as needed.
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateMenu(id, updatedData){
    try {
      const response = await fetch(`http://localhost:3000/mms/admin/messmenu/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getMessOffStudents(){
    try{
      const today = new Date();
      const day = today.getDate();
      console.log("Current Day :",day);
      const responce = await fetch(`http://localhost:3000/mms/admin/messOffStudents/${day}`,);
  
      if(!responce.ok){
        throw new Error(`HTTP error! Status: ${responce.status}`);
      }
      const data = await responce.json();
      return data;
    } catch (error){
      console.error("Error:", error )
    }
  }


  module.exports = {
    fetchStudents,
    submitStudent, 
    deleteStudent, 
    getStudentById, 
    updateStudent,
    updateAdmin,
    fetchMenu,
    updateMenu,
    validate,
    logout,
    getAdminbyID,
    getMessOffStudents
  };