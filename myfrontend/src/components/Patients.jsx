import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import Navbar from './Navbar';
import './style.css';

const PatientComponent = () => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [patients, setPatients] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(5);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const showToast = (severity, summary) => {toast.current.show({ severity, summary, life: 3000 });};
  const cols = [
    { field: 'hospital_number', header: 'Hospital Number' },
    { field: 'first_name', header: 'First Name' },
    { field: 'middle_name', header: 'Middle Name' },
    { field: 'last_name', header: 'Last name' },
    { field: 'birth_date', header: 'Birth Date' },
    { field: 'age', header: 'Age' },
    { field: 'address', header: 'Address' },
    { field: 'gender', header: 'Gender' },
  ];
  const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
  
  useEffect(() => {
    fetch('/api/patients/')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);
  
  const exportCSV = (selectionOnly) => { dt.current.exportCSV({ selectionOnly });};
  const exportPdf = () => {
      import('jspdf').then((jsPDF) => {
          import('jspdf-autotable').then(() => {
              const doc = new jsPDF.default(0, 0);
              doc.autoTable(exportColumns, patients);
              doc.save('patients.pdf');
          });
      });
  };

  const exportExcel = () => {
      import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(patients);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          saveAsExcelFile(excelBuffer, 'patients');
      });
  };

  const saveAsExcelFile = (buffer, fileName) => {
      import('file-saver').then((module) => {
          if (module && module.default) {
              let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
              let EXCEL_EXTENSION = '.xlsx';
              const data = new Blob([buffer], { type: EXCEL_TYPE });
              module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
          }
      });
  };
  const onGlobalFilterChange = (e) => { setGlobalFilter(e.target.value); };
  const filterData = (value) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(globalFilter.toLowerCase());
      }
    }
    return false;
  };

  const filteredData = patients.filter((rowData) => { return Object.values(rowData).some((field) => filterData(field)); });

  const showAddDialog = () => { reset(); setDisplayAddDialog(true); };
  const hideAddDialog = () => { setDisplayAddDialog(false); };
  const showEditDialog = (rowData) => {
    setSelectedPatient(rowData);
    setDisplayEditDialog(true);
    setValue('first_name', rowData.first_name);
    setValue('middle_name', rowData.middle_name);
    setValue('last_name', rowData.last_name);
    setValue('hospital_number', rowData.hospital_number);
    setValue('birth_date', rowData.birth_date);
    setValue('age', rowData.age);
    setValue('address', rowData.address);
    setValue('gender', rowData.gender);
  };
  const hideEditDialog = () => { setDisplayEditDialog(false); setSelectedPatient(null); };
  const showDeleteDialog = (rowData) => { setSelectedPatient(rowData); setDisplayDeleteDialog(true); };
  const hideDeleteDialog = () => { setDisplayDeleteDialog(false); setSelectedPatient(null); };

  const addPatient = (data) => {
    fetch('/api/patients/', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add patient. Please try again.');
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData) {
          setPatients((prevPatients) => [...prevPatients, responseData]);
          hideAddDialog();
          showToast('success', 'Patient has been successfully added.');
        } else {
          throw new Error('Unexpected response from the server.');
        }
      })
      .catch((error) => {
        console.error('Error adding patient:', error.message);
        showToast('error', error.message);
      });
  };
  
  const editPatient = (data) => {
    console.log('Editing patient:', data);
  
    fetch(`/api/patients/${selectedPatient.id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), })
      .then(async (response) => {
        if (response.ok) {
          const updatedPatient = await response.json();
          setPatients((prevPatients) =>
            prevPatients.map((patient) =>
              patient.id === selectedPatient.id ? updatedPatient : patient
            )
          );
          hideEditDialog();
  
          showToast('success', 'Patient has been successfully updated.');
        } else {
          const errorMessage = await response.text();
          showToast('error', `Failed to update patient`);
        }
      })
      .catch((error) => {
        console.error('Error editing patient:', error);
        showToast('error', 'Error updating patient. Please try again.');
      });
  };
  
  const deletePatient = () => {
    fetch(`/api/patients/${selectedPatient.id}`, { method: 'DELETE', })
      .then((response) => {
        if (response.ok) {
          setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== selectedPatient.id));
          hideDeleteDialog();
          showToast('success', 'Patient has been successfully deleted.');
        } else {
          showToast('error', 'Failed to delete patient. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting patient:', error);
        showToast('error', 'Failed to delete patient. Please try again.');
      });
  };

  const addDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={hideAddDialog} className="p-button-text" />
      <Button label="Add" icon="pi pi-check" onClick={handleSubmit(addPatient)} autoFocus />
    </div>
  );

  const editDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={hideEditDialog} className="p-button-text" />
      <Button label="Update" icon="pi pi-check" onClick={handleSubmit(editPatient)} autoFocus />
    </div>
  );

  const deleteDialogFooter = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={hideDeleteDialog} className="p-button-text" />
      <Button label="Yes" icon="pi pi-check" onClick={deletePatient} autoFocus />
    </div>
  );

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div>
        <Dropdown value={rows} options={[5, 10, 15]} onChange={(e) => setRows(e.value)} placeholder="Show Entries" className="p-mr-2" />
      </div>
      <div className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText type="text" placeholder="Global Search" value={globalFilter} onChange={onGlobalFilterChange} size="20" />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <br></br>
      <div className="button-container">
      <Button label="Add Patient" icon="pi pi-plus" onClick={showAddDialog} />
      <div className="export-buttons">
      <Button label="CSV" type="button" icon="pi pi-file" onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
      <Button label="EXCEL" type="button" icon="pi pi-file-excel" severity="success" onClick={exportExcel} data-pr-tooltip="XLS" />
      <Button label="PDF" type="button" icon="pi pi-file-pdf" severity="warning" onClick={exportPdf} data-pr-tooltip="PDF" />
     </div>
    </div>
      <br></br>
      <DataTable ref={dt} value={filteredData} paginator rows={rows} header={header} emptyMessage="No records found" selectionMode="single">
        {cols.map((col, index) => (<Column key={index} field={col.field} header={col.header} filter={true} sortable/>))}
        <Column header="Action" body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => showEditDialog(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => showDeleteDialog(rowData)} />
            </div>
          )}
        />
      </DataTable>
      
      <Dialog visible={displayAddDialog} onHide={hideAddDialog} header="Add Patient" footer={addDialogFooter}>
        <form>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label htmlFor="first_name">First Name</label>
              <Controller control={control} name="first_name" rules={{ required: 'First Name is required' }} render={({ field }) => ( <InputText id="first_name" {...field} />)}/>
              {errors.first_name && (<small className="p-error"> {errors.first_name.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="middle_name">Middle Name</label>
              <Controller control={control} name="middle_name" render={({ field }) => ( <InputText id="middle_name" {...field} />)}/>
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="last_name">Last Name</label>
              <Controller control={control} name="last_name" rules={{ required: 'First Name is required' }} render={({ field }) => ( <InputText id="last_name" {...field} />)}/>
                {errors.last_name && (<small className="p-error"> {errors.last_name.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="hospital_number">Hospital Number</label>
              <Controller control={control} name="hospital_number" rules={{ required: 'Hospital Number is required', pattern: { value: /^[0-9]+$/, message: 'Hospital Number must be a number',},}}render={({ field }) => ( <InputText id="hospital_number" {...field} />)}/>
              {errors.hospital_number && (<small className="p-error"> {errors.hospital_number.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="birth_date">Birth Date</label>
              <Controller control={control} name="birth_date" rules={{ required: 'Birth Date is required', validate: (value) => {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    if (selectedDate >= currentDate) {
                      return 'Birth Date must be in the past.';
                    } return true; }, }} 
                    render={({ field }) => (<InputText id="birth_date" type="date" {...field} />)}/>
              {errors.birth_date && (<small className="p-error"> {errors.birth_date.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="age">Age</label>
              <Controller control={control} name="age" rules={{ required: 'Age is required' }} render={({ field }) => ( <InputText id="age" type="number" {...field} />)}/>
              {errors.age && (<small className="p-error"> {errors.age.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="address">Address</label>
              <Controller control={control} name="address" rules={{ required: 'Address is required' }} render={({ field }) => ( <InputText id="address" {...field} />)}/>
              {errors.address && (<small className="p-error"> {errors.address.message} </small>)}
            </div>
            <div className="p-col-12 p-md-6">
            <label htmlFor="gender">Gender</label>
            <Controller control={control} name="gender" rules={{ required: 'Gender is required' }} render={({ field }) => (
                <Dropdown id="gender" {...field}
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  placeholder="Select Gender" />)}/>
            {errors.gender && (<small className="p-error"> {errors.gender.message} </small>)}
          </div>
          </div>
        </form>
      </Dialog>

      <Dialog visible={displayEditDialog} onHide={hideEditDialog} header="Edit Patient" footer={editDialogFooter} >
        <form>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label htmlFor="efirst_name">First Name</label>
              <Controller control={control} name="first_name" rules={{ required: 'First Name is required' }} render={({ field }) => ( <InputText id="first_name" {...field} /> )} />
              {errors.first_name && ( <small className="p-error"> {errors.first_name.message} </small> )}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="middle_name">Middle Name</label>
              <Controller control={control} name="middle_name" render={({ field }) => ( <InputText id="middle_name" {...field} /> )} />
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="last_name">Last Name</label>
              <Controller control={control} name="last_name" rules={{ required: 'Last Name is required' }} render={({ field }) => ( <InputText id="last_name" {...field} /> )}/>
                {errors.last_name && ( <small className="p-error"> {errors.last_name.message} </small> )}
            </div>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label htmlFor="hospital_number">Hospital Number</label>
              <Controller control={control} name="hospital_number" rules={{ required: 'Hospital Number is required', pattern: { value: /^[0-9]+$/, message: 'Hospital Number must be a number', }, }} render={({ field }) => ( <InputText id="hospital_number" {...field} /> )} />
              {errors.hospital_number && ( <small className="p-error"> {errors.hospital_number.message} </small> )}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="birth_date">Birth Date</label>
              <Controller control={control} name="birth_date" rules={{ required: 'Birth Date is required', validate: (value) => {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    if (selectedDate >= currentDate) {
                      return 'Birth Date must be in the past.';
                    } return true; }, }} 
                    render={({ field }) => (<InputText id="birth_date" type="date" {...field} />)}/>
              {errors.birth_date && (<small className="p-error"> {errors.birth_date.message} </small>)}
            </div>
            
            <div className="p-col-12 p-md-6">
              <label htmlFor="age">Age</label>
              <Controller control={control} name="age" rules={{ required: 'Age is required' }} render={({ field }) => ( <InputText id="age" type="number" {...field} /> )} />
              {errors.age && ( <small className="p-error"> {errors.age.message} </small> )}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="address">Address</label>
              <Controller control={control} name="address" rules={{ required: 'Address is required' }} render={({ field }) => ( <InputText id="address" {...field} /> )} />
              {errors.address && ( <small className="p-error"> {errors.address.message} </small> )}
            </div>
            <div className="p-col-12 p-md-6">
              <label htmlFor="gender">Gender</label>
              <Controller control={control} name="gender" rules={{ required: 'Gender is required' }} render={({ field }) => (
                  <Dropdown id="gender" {...field}
                    options={[
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                      { label: 'Other', value: 'Other' },
                    ]} placeholder="Select Gender" /> )} />
              {errors.gender && ( <small className="p-error"> {errors.gender.message} </small> )}
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog visible={displayDeleteDialog} onHide={hideDeleteDialog} header="Confirm Delete" footer={deleteDialogFooter} >
        <div> Are you sure you want to delete the patient?</div>
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
};

export default PatientComponent;
