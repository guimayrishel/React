import React, { useState, useEffect } from 'react';
import '../Card.css';
import Navbar from './Navbar';

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState(null);
  const [carCount, setCarCount] = useState(null);
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
        setPatientCount(data.patient_count);
        setCarCount(data.car_count);
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
   
    <div className='cards'>
       <div><Navbar /></div>
      <h1>Dashboard</h1>
<div className="card-container">
<div className="card">
<div className="card-header">
  Patient Count
</div>
<div className="card-body">
  <h2>{patientCount}</h2> 
</div>
</div>
<div className="card">
<div className="card-header">
Car Count
</div>
<div className="card-body">
  <h2>{carCount}</h2> 
</div>
</div>
<div className="card">
<div className="card-header">
Ward Count
</div>
<div className="card-body">
  <h2>{patientCount}</h2> 
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

