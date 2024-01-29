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

const WardComponent = () => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [ward, setWard] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(5);
  const [selectedWard, setSelectedWard] = useState(null);
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const showToast = (severity, summary) => { toast.current.show({ severity, summary, life: 3000 }); };
  const cols = [ { field: 'ward_name', header: 'Ward Name' },];
  const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

  useEffect(() => {
    fetch('/api/wards/')
      .then((response) => response.json())
      .then((data) => setWard(data))
      .catch((error) => console.error('Error fetching Wards:', error));
  }, []);
  
  const exportCSV = (selectionOnly) => { dt.current.exportCSV({ selectionOnly }); };

  const exportPdf = () => {
      import('jspdf').then((jsPDF) => {
          import('jspdf-autotable').then(() => {
              const doc = new jsPDF.default(0, 0);
              doc.autoTable(exportColumns, ward);
              doc.save('wards.pdf');
          });
      });
  };

  const exportExcel = () => {
      import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(ward);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array'});
          saveAsExcelFile(excelBuffer, 'ward');
      });
  };

  const saveAsExcelFile = (buffer, fileName) => {
      import('file-saver').then((module) => {
          if (module && module.default) {
              let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
              let EXCEL_EXTENSION = '.xlsx';
              const data = new Blob([buffer], { type: EXCEL_TYPE});
              module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
          }
      });
  };
  const onGlobalFilterChange = (e) => { setGlobalFilter(e.target.value);};

  const filterData = (value) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(globalFilter.toLowerCase());
      }
    }
    return false;
  };

  const filteredData = ward.filter((rowData) => { return Object.values(rowData).some((field) => filterData(field)); });
  const showAddDialog = () => { reset(); setDisplayAddDialog(true); };
  const hideAddDialog = () => { setDisplayAddDialog(false); };
  const showEditDialog = (rowData) => { setSelectedWard(rowData); setDisplayEditDialog(true); setValue('ward_name', rowData.ward_name); };
  const hideEditDialog = () => { setDisplayEditDialog(false); setSelectedWard(null); };
  const showDeleteDialog = (rowData) => { setSelectedWard(rowData); setDisplayDeleteDialog(true); };
  const hideDeleteDialog = () => { setDisplayDeleteDialog(false); setSelectedWard(null); };

  const addPatient = (data) => {
    fetch('/api/wards/', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add ward. Please try again.');
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData) {
          setWard((prevPatients) => [...prevPatients, responseData]);
          hideAddDialog();
          showToast('success', 'Ward has been successfully added.');
        } else {
          throw new Error('Unexpected response from the server.');
        }
      })
      .catch((error) => {
        console.error('Error adding ward', error.message);
        showToast('error', 'Error adding ward');
      });
  };
  
  const editPatient = (data) => {
    console.log('Editing ward:', data);
  
    fetch(`/api/wards/${selectedWard.id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), })
      .then(async (response) => {
        if (response.ok) {
          const updatedWard = await response.json();
          setWard((prevWard) =>
            prevWard.map((ward) =>
            ward.id === selectedWard.id ? updatedWard : ward
            )
          );
          hideEditDialog();
          showToast('success', 'Ward has been successfully updated.');
        } else {
          const errorMessage = await response.text();
          showToast('error', `Failed to update ward`);
        }
      })
      .catch((error) => {
        console.error('Error editing ward:', error);
        showToast('error', 'Error updating ward. Please try again.');
      });
  };
  
  const deletePatient = () => {
    fetch(`/api/wards/${selectedWard.id}`, { method: 'DELETE', })
      .then((response) => {
        if (response.ok) {
          setWard((prevWard) => prevWard.filter((ward) => ward.id !== selectedWard.id));
          hideDeleteDialog();
          showToast('success', 'Ward has been successfully deleted.');
        } else {
          showToast('error', 'Failed to delete Ward. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting ward:', error);
        showToast('error', 'Failed to delete ward. Please try again.');
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
      <Button label="Add Ward" icon="pi pi-plus" onClick={showAddDialog} />
      <div className="export-buttons">
      <Button label="CSV" type="button" icon="pi pi-file" onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
      <Button label="EXCEL" type="button" icon="pi pi-file-excel" severity="success" onClick={exportExcel} data-pr-tooltip="XLS" />
      <Button label="PDF" type="button" icon="pi pi-file-pdf" severity="warning" onClick={exportPdf} data-pr-tooltip="PDF" />
     </div>
    </div>
      <br></br>
      <DataTable ref={dt} value={filteredData} paginator rows={rows} header={header} emptyMessage="No records found" selectionMode="single">
        {cols.map((col, index) => (<Column key={index} field={col.field} header={col.header} filter={true} sortable/>))}
        <Column header='Action' body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => showEditDialog(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => showDeleteDialog(rowData)} />
            </div>
          )}
        />
      </DataTable>
      
      <Dialog visible={displayAddDialog} onHide={hideAddDialog} header="Add Ward" footer={addDialogFooter}>
        <form>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label htmlFor="ward_name">Ward Name</label>
              <Controller control={control} name="ward_name" rules={{ required: 'Ward Name is required' }} render={({ field }) => (
                  <InputText id="first_name" {...field} />)}/>
              {errors.ward_name && (<small className="p-error"> {errors.ward_name.message} </small>)}
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog visible={displayEditDialog} onHide={hideEditDialog} header="Edit Ward" footer={editDialogFooter} >
        <form>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label htmlFor="efirst_name">Ward Name</label>
              <Controller control={control} name="ward_name" rules={{ required: 'Ward Name is required' }} render={({ field }) => (
                  <InputText id="ward_name" {...field} />
                )}/>
              {errors.ward_name && (<small className="p-error"> {errors.ward_name.message} </small>)}
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog visible={displayDeleteDialog} onHide={hideDeleteDialog} header="Confirm Delete" footer={deleteDialogFooter} >
        <div> Are you sure you want to delete the patient? </div>
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
};

export default WardComponent;
