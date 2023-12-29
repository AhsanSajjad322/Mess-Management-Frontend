const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');


async function validate(credentials) {
  try{
    console.log("Working")
    const response = await fetch('http://localhost:3000/mms/student/login-student', {
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
    const response = await fetch('http://localhost:3000/mms/student/logout-student', {
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
  }
}

async function getStudentbyID(id){
  try{
    const response = await fetch(`http://localhost:3000/mms/student/students/${id}`);
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

async function updateStudent(id, updatedData){
  try{
    const response = await fetch(`http://localhost:3000/mms/student/students/${id}`,{
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

async function getStudentByEmailAndPass(email, password){
    try{
        const response = await fetch(`http://localhost:3000/mms/student/${email}/${password}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data;
    } catch(error){
        console.error("Error: ",error);
    }
}

async function processMessOffRequest(studentId, day, mealtype) {
    try {
      const requestData = {
        day: day,
        mealtype: mealtype,
      };
  
      const response = await fetch(`http://localhost:3000/mms/student/${studentId}/calendar`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedCalendar = await response.json();
      return updatedCalendar;
    } catch (error) {
      console.error("Error: ", error);
    }
  }
  
  


module.exports = {
    // getStudentByEmailAndPass,
    processMessOffRequest,
    validate,
    logout,
    getStudentbyID,
    updateStudent
};