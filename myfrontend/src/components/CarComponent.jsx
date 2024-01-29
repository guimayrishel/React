// myreactapp/src/CarComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from './Navbar';

const CarComponent = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(5);
  const [carData, setCarData] = useState({ brand: '', model: '', year: '', color: '', });
  const onGlobalFilterChange = (e) => { setGlobalFilter(e.target.value); };
  const filterData = (value) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(globalFilter.toLowerCase());
      }
    }
    return false;
  };
  const filteredData = cars.filter((rowData) => { return Object.values(rowData).some((field) => filterData(field)); });
  const [validationErrors, setValidationErrors] = useState({ brand: '', model: '', year: '', color: '', });
  const toast = useRef(null);
  useEffect(() => { fetchCars(); }, []);
  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars/');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const onCarSelect = (event) => { setSelectedCar(event.data); setCarData({ ...event.data }); setDisplayDialog(true); };

  const onDialogHide = () => {
    setSelectedCar(null);
    setCarData({ brand: '', model: '', year: '', color: '', });
    setValidationErrors({ brand: '', model: '', year: '', color: '', });
    setDisplayDialog(false);
  };

  const updateCar = async () => {
    if (!validateInput()) {
      // showToast('error', 'Invalid input. Please check the fields.');
      return;
    }
    try {
      await axios.put(`/api/cars/${selectedCar.id}/`, carData);
      fetchCars();
      onDialogHide();
      showToast('success', 'Car updated successfully!');
    } catch (error) {
      console.error('Error updating car:', error);
      showToast('error', 'Error updating car. Please try again.');
    }
  };

  const deleteCar = async () => {
    try {
      await axios.delete(`/api/cars/${selectedCar.id}/`);
      fetchCars();
      onDialogHide();
      showToast('success', 'Car deleted successfully!');
    } catch (error) {
      console.error('Error deleting car:', error);
      showToast('error', 'Error deleting car. Please try again.');
    }
  };

  const createCar = async () => {
    if (!validateInput()) {
      // showToast('error', 'Invalid input. Please check the fields.');
      return;
    }

    try {
      await axios.post('/api/cars/', carData);
      fetchCars();
      onDialogHide();
      showToast('success', 'Car created successfully!');
    } catch (error) {
      console.error('Error creating car:', error);
      showToast('error', 'Error creating car. Please try agains.');
    }
  };

  const validateInput = () => {
    let isValid = true;
    const errors = { brand: '', model: '', year: '', color: '', };

    if (!carData.brand.trim()) { errors.brand = 'Brand is required'; isValid = false; }
    if (!carData.model.trim()) { errors.model = 'Model is required'; isValid = false; }
    if (!carData.year.trim() || +carData.year < 1900 || +carData.year > new Date().getFullYear()) { errors.year = 'Invalid year'; isValid = false; }
    if (!carData.color.trim()) { errors.color = 'Color is required'; isValid = false; }
    setValidationErrors(errors); return isValid;};

  const showToast = (severity, summary) => { toast.current.show({ severity, summary, life: 3000 }); };
  const exportData = () => {
    const exportData = cars.map(({ id, brand, model, year, color }) => ({ id, brand, model, year, color }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'car_data.xlsx');
  };

  const exportToPDF = () => {
    const columns = [
      { title: 'Brand', dataKey: 'brand' },
      { title: 'Model', dataKey: 'model' },
      { title: 'Year', dataKey: 'year' },
      { title: 'Color', dataKey: 'color' },
    ];

    const rows = cars.map((car) => ({ brand: car.brand, model: car.model, year: car.year, color: car.color, }));
    const pdf = new jsPDF();
    pdf.autoTable(columns, rows, { startY: 20 });
    pdf.save('cars.pdf');
  };
  const header = (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',  marginBottom: '1rem', }} >
      <div>
        <Dropdown value={rows} options={[5, 10, 15]} onChange={(e) => setRows(e.value)} placeholder="Show Entries" className="p-mr-2"/>
      </div>
      <div>
        <Button label="Excel" icon="pi pi-file-excel" onClick={exportData} />
        <Button label="PDF" icon="pi pi-file-pdf" onClick={exportToPDF} />
        <Button label="Print" icon="pi pi-print" onClick={() => window.print()} />
      </div>
      <div>
        <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }} />
        <InputText type="text" placeholder="Global Search" value={globalFilter} onChange={onGlobalFilterChange} size="30"/>
      </div>
    </div>
  );

  const footer = (
    <div>
      {selectedCar ? (
        <>
          <Button label="Update" icon="pi pi-check" onClick={updateCar} />
          <Button label="Delete" icon="pi pi-trash" onClick={deleteCar} className="p-button-danger" />
        </>
      ) : (
        <Button label="Add Car" icon="pi pi-check" onClick={createCar} />
      )}
      <Button label="Cancel" icon="pi pi-times" onClick={onDialogHide} className="p-button-secondary" />
    </div>
  );
  return (
    <div>
      <Navbar />
      <h1>Car Information</h1>
      <Button label="Add Car" icon="pi pi-plus" onClick={() => setDisplayDialog(true)} />
      <DataTable value={filteredData} paginator rows={rows} header={header} emptyMessage="No records found" selectionMode="single" selection={selectedCar} onSelectionChange={(e) => setSelectedCar(e.value)} onRowSelect={onCarSelect} >
        <Column field="brand" header="Brand" filter={true} sortable></Column>
        <Column field="model" header="Model" filter={true} sortable></Column>
        <Column field="year" header="Year" filter={true} sortable></Column>
        <Column field="color" header="Color" filter={true} sortable></Column>
      </DataTable>
      <Dialog visible={displayDialog} style={{ width: '400px' }} header="Car Details" onHide={onDialogHide} footer={footer}>
      <div className="p-fluid">
      <div className="p-field">
        <label htmlFor="brand">Brand:</label>
        <InputText id="brand" value={carData.brand} onChange={(e) => setCarData({ ...carData, brand: e.target.value })} className={`p-inputtext ${validationErrors.brand ? 'p-invalid' : ''}`} />
        <small className="p-error">{validationErrors.brand}</small>
      </div>
      <div className="p-field">
        <label htmlFor="model">Model:</label>
        <InputText id="model" value={carData.model} onChange={(e) => setCarData({ ...carData, model: e.target.value })} className={`p-inputtext ${validationErrors.model ? 'p-invalid' : ''}`} />
        <small className="p-error">{validationErrors.model}</small>
      </div>
      <div className="p-field">
        <label htmlFor="year">Year:</label>
        <InputText id="year" value={carData.year} onChange={(e) => setCarData({ ...carData, year: e.target.value })} className={`p-inputtext ${validationErrors.year ? 'p-invalid' : ''}`}/>
        <small className="p-error">{validationErrors.year}</small>
      </div>
      <div className="p-field">
        <label htmlFor="color">Color:</label>
        <InputText id="color" value={carData.color} onChange={(e) => setCarData({ ...carData, color: e.target.value })} className={`p-inputtext ${validationErrors.color ? 'p-invalid' : ''}`} />
        <small className="p-error">{validationErrors.color}</small>
      </div>
      </div>
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
};

export default CarComponent;
