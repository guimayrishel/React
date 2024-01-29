import React, { useState, useEffect } from 'react';
import './Card.css';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setStudentCount(data.student_count);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
   
    <div className=''>
     
      <h1>Dashboard</h1>
<div class="card-container">
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
</div>

<div class="card-container">
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
<div class="card">
<div class="card-header">
  Student Count
</div>
<div class="card-body">
  <h2>{studentCount}</h2> 
</div>
</div>
</div>
</div>
  );
};

export default Dashboard;



// // Dashboard.js
// import React, { useState, useEffect } from 'react';

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setData(data);
//         setIsLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setIsLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>; // Loading state while data is being fetched
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>; // Error state if fetching data fails
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <ul>
//         {data.map(student => (
//           <li key={student.id}>{student.first_name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;

