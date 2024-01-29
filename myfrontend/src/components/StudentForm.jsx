// import React, { useState } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { Button } from 'primereact/button';
// import * as XLSX from 'xlsx';

// const TableComponent = () => {
//   const [cars, setData] = useState([
//     { id: 1, brand: 'Toyota', model: 'Camry', year: 2022, color: 'Blue' },
//     { id: 2, brand: 'Honda', model: 'Accord', year: 2021, color: 'Red' },
//     { id: 3, brand: 'Ford', model: 'Mustang', year: 2020, color: 'Yellow' },
//     { id: 4, brand: 'Toyota', model: 'Camry', year: 2022, color: 'Blue' },
//     { id: 5, brand: 'Honda', model: 'Accord', year: 2021, color: 'Red' },
//     { id: 6, brand: 'Ford', model: 'Mustang', year: 2020, color: 'Yellow' },
//     { id: 7, brand: 'Toyota', model: 'Camry', year: 2022, color: 'Blue' },
//     { id: 8, brand: 'Honda', model: 'Accord', year: 2021, color: 'Red' },
//     { id: 9, brand: 'Ford', model: 'Mustang', year: 2020, color: 'Yellow' },
//     { id: 10, brand: 'Toyota', model: 'Camry', year: 2022, color: 'Blue' },
//     { id: 11, brand: 'Honda', model: 'Accord', year: 2021, color: 'Red' },
//     { id: 12, brand: 'Ford', model: 'Mustang', year: 2020, color: 'Yellow' },
//     // Add more data as needed
//   ]);

//   const [globalFilter, setGlobalFilter] = useState('');
//   const [rows, setRows] = useState(5); // Initialize rows with a default value

//   const onGlobalFilterChange = (e) => {
//     setGlobalFilter(e.target.value);
//   };

//   const onCustomPage = (e) => {
//     setRows(e.value);
//   };

//   const filterData = (value) => {
//     if (value !== null && value !== undefined) {
//       return String(value).toLowerCase().includes(globalFilter.toLowerCase());
//     }
//     return false;
//   };

//   const filteredData = cars.filter((rowData) => {
//     return Object.values(rowData).some((field) => filterData(field));
//   });

//   const exportData = () => {
//     try {
//       const exportData = cars.map(({ id, brand, model, year, color }) => ({ id, brand, model, year, color }));
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//       XLSX.writeFile(wb, 'car_data.xlsx');
//     } catch (error) {
//       console.error('Error exporting data:', error);
//     }
//   };

//   const header = (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '1rem',
//       }}
//     >
//       <div>
//         <Dropdown
//           value={rows}
//           options={[5, 10, 15]}
//           onChange={onCustomPage}
//           placeholder="Show Entries"
//           className="p-mr-2"
//         />
//       </div>
//       <div>
//         <Button label="Export Data" icon="pi pi-download" onClick={exportData} className="p-button-success" />
//       </div>
//       <div>
//         <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }} />
//         <InputText
//           type="text"
//           placeholder="Global Search"
//           value={globalFilter}
//           onChange={onGlobalFilterChange}
//           size="30"
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       <h1>Car Information</h1>
//       <DataTable
//         value={filteredData}
//         emptyMessage="No records found"
//         globalFilter={globalFilter}
//         paginator
//         rows={rows}
//         rowsPerPageOptions={[5, 10, 15]}
//         header={header}
//       >
//         <Column field="id" header="ID" filter={true} sortable></Column>
//         <Column field="brand" header="Brand" filter={true} sortable></Column>
//         <Column field="model" header="Model" filter={true} sortable></Column>
//         <Column field="year" header="Year" filter={true} sortable></Column>
//         <Column field="color" header="Color" filter={true} sortable></Column>
//       </DataTable>
//     </div>
//   );
// };

// export default TableComponent;




// // // import React from 'react';
// // // import { useForm, Controller } from 'react-hook-form';

// // // const MyForm = () => {
// // //   const { handleSubmit, control, register, formState: { errors } } = useForm();

// // //   const onSubmit = (data) => {
// // //     console.log(data);
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit(onSubmit)}>
// // //       {/* Basic Input */}
// // //       <label>Email:</label>
// // //       <input {...register('email', { required: 'Email is required' })} />
// // //       {errors.email && <p>{errors.email.message}</p>}

// // //       {/* Controlled Input */}
// // //       <label>Password:</label>
// // //       <Controller
// // //         control={control}
// // //         name="password"
// // //         render={({ field }) => (
// // //           <input {...field} type="password" />
// // //         )}
// // //         rules={{ required: 'Password is required' }}
// // //       />
// // //       {errors.password && <p>{errors.password.message}</p>}

// // //       {/* Submit Button */}
// // //       <button type="submit">Submit</button>
// // //     </form>
// // //   );
// // // };

// // // export default MyForm;

// // import React, { useState } from 'react';
// // import { DataTable } from 'primereact/datatable';
// // import { Column } from 'primereact/column';
// // import 'primereact/resources/primereact.min.css';
// // import 'primereact/resources/themes/saga-blue/theme.css';
// // import 'primeicons/primeicons.css';

// // const MyDataTable = () => {
// //   const [data, setData] = useState([
// //     { id: 1, name: 'John Doe', age: 25 },
// //     { id: 2, name: 'Jane Doe', age: 30 },
// //     { id: 3, name: 'Bob Smith', age: 28 },
// //     // Add more data as needed
// //   ]);

// //   const [globalFilter, setGlobalFilter] = useState('');

// //   const onGlobalFilterChange = (e) => {
// //     setGlobalFilter(e.target.value);
// //   };

// //   const filterData = (value) => {
// //     if (value !== null && value !== undefined) {
// //       return String(value).toLowerCase().includes(globalFilter.toLowerCase());
// //     }
// //     return false;
// //   };

// //   const filteredData = data.filter((rowData) => {
// //     return Object.values(rowData).some((field) => filterData(field));
// //   });

// //   const header = (
// //     <div style={{ textAlign: 'left' }}>
// //       <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }} />
// //       <input
// //         type="text"
// //         placeholder="Global Search"
// //         value={globalFilter}
// //         onChange={onGlobalFilterChange}
// //         style={{ width: '250px' }}
// //       />
// //     </div>
// //   );

// //   return (
// //     <div>
// //       <DataTable
// //         value={filteredData}
// //         emptyMessage="No records found"
// //         header={header}
// //       >
// //         <Column field="id" header="ID" style={{ width: '50px' }} />
// //         <Column field="name" header="Name" filter={true}></Column>
// //         <Column field="age" header="Age" filter={true}></Column>
// //       </DataTable>
// //     </div>
// //   );
// // };

// // export default MyDataTable;

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
// import { ExcelExporter } from 'primereact/excelexport';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import Navbar from './Navbar';

const MyDataTable = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Doe', age: 30 },
    { id: 3, name: 'Bob Smith', age: 28 },
    // Add more data as needed
  ]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(5); // Number of rows per page

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const filterData = (value) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(globalFilter.toLowerCase());
      }
    }
    return false;
  };

  const filteredData = data.filter((rowData) => {
    return Object.values(rowData).some((field) => filterData(field));
  });

  const exportExcel = () => {
    excelExporter.current.exportCSV();
  };

  const excelExporter = React.createRef();

  const onPageChange = (event) => {
    setRows(event.rows);
  };

  const showEntriesTemplate = (
    <Dropdown
      value={rows}
      options={[5, 10, 20]}
      onChange={(e) => setRows(e.value)}
      placeholder="Show Entries"
    />
  );

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        {showEntriesTemplate}
      </div>
      <div>
        <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }} />
        <input
          type="text"
          placeholder="Global Search"
          value={globalFilter}
          onChange={onGlobalFilterChange}
          size="30"
        />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div className="p-mb-3">
        {/* <Button label="Export to Excel" icon="pi pi-file-excel" onClick={exportExcel} /> */}
      </div>

      <DataTable
        value={filteredData}
        paginator
        rows={rows}
        onPage={onPageChange}
        emptyMessage="No records found"
        header={header}
        ref={excelExporter}
      >
        <Column field="id" header="ID" style={{ width: '50px' }} />
        <Column field="name" header="Name" filter={true}></Column>
        <Column field="age" header="Age" filter={true}></Column>
      </DataTable>
    </div>
  );
};

export default MyDataTable;
