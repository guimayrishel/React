import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { SplitButton } from 'primereact/splitbutton';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { format } from 'date-fns';
import axios from 'axios';
import '../styles/styles.css';

// Define constants for API URLs
// const PATIENTS_API_URL = 'http://192.168.254.143:8000/api/patients/';
// const WARDS_API_URL = 'http://192.168.254.143:8000/api/wards/';
const WARDS_API_URL = 'http://127.0.0.1:8000/api/wards/';
const PATIENTS_API_URL = 'http://127.0.0.1:8000/api/patients/';

const DataTableWithModal = () => {
    const [patients, setPatients] = useState(null);
    const [wardNames, setWardNames] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        last_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        first_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        middle_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        gender: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        birthday: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ward_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const toast = useRef(null);
    const confirmPopupRef = useRef(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(PATIENTS_API_URL);
                setPatients(getPatients(response.data));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        const fetchWardNames = async () => {
            try {
                const response = await axios.get(WARDS_API_URL);
                setWardNames(response.data);
            } catch (error) {
                console.error('Error fetching ward names:', error);
            }
        };

        fetchWardNames();
    }, []);

    const getPatients = (data) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const renderWardName = (rowData) => {
        const ward = wardNames.find((ward) => ward.id === rowData.ward_name);
        return ward ? ward.ward_name : '';
    };

    const hiddenColumns = ['id'];
    const dynamicColumns = patients
        ? Object.keys(patients[0]).map((key, index) => {
            if (hiddenColumns.includes(key)) {
                return null;
            }

            let columnHeader;

            switch (key) {
                case 'last_name':
                    columnHeader = 'Last Name';
                    break;
                case 'first_name':
                    columnHeader = 'First Name';
                    break;
                case 'middle_name':
                    columnHeader = 'Middle Name';
                    break;
                case 'gender':
                    columnHeader = 'Gender';
                    break;
                case 'birthday':
                    columnHeader = 'Birthday';
                    break;
                case 'ward_name':
                    columnHeader = 'Ward Name';
                    return <Column key={index} field={key} header={columnHeader} body={renderWardName} />;

                default:
                    columnHeader = key;
            }

            return <Column key={index} field={key} header={columnHeader} filter filterPlaceholder={`Search by ${columnHeader}`} />;
        })
        : null;

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onRowSelect = (event) => {
        setSelectedPatient(event.data);
        setDisplayDialog(false);
    };

    const onHide = () => {
        setDisplayDialog(false);
    };

    const renderHeader = () => {
        return (
            <React.Fragment>
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </React.Fragment>
        );
    };

    const renderAddNew = () => {
        return (
            <React.Fragment>
                <span className="p-ml-auto">
                    <Button icon="pi pi-plus" label={isAddingNew ? 'Cancel' : 'Add'} severity="secondary" raised onClick={handleAdd} />
                </span>
            </React.Fragment>
        );
    };

    const handleAdd = () => {
        setEditedPatient({
            last_name: '',
            first_name: '',
            middle_name: '',
            gender: '',
            birthday: '',
        });
        setIsAddingNew(true);
        setDisplayDialog(true);
    };

    const handleEdit = (rowData) => {
        setSelectedPatient(rowData);

        const { gender, birthday, ...otherFields } = rowData;
        const parsedBirthday = birthday ? new Date(birthday) : null;

        setEditedPatient({
            ...otherFields,
            gender,
            birthday: parsedBirthday,
        });

        setDisplayDialog(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
        }));
    };

    const updatePatient = (updatedPatient) => {
        setPatients((prevPatients) =>
            prevPatients.map((patient) =>
                patient.id === updatedPatient.id ? updatedPatient : patient
            )
        );
    };

    const handleSave = async () => {
        let formattedBirthday;
        try {
            if (isAddingNew) {
                formattedBirthday = format(new Date(editedPatient.birthday), 'yyyy-MM-dd');
                const PatientWithFormattedBirthday = {
                    ...editedPatient,
                    birthday: formattedBirthday,
                };

                const response = await axios.post(PATIENTS_API_URL, PatientWithFormattedBirthday);
                const newPatient = response.data;

                setPatients((prevPatients) => [...prevPatients, newPatient]);

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Patient added successfully',
                    life: 3000,
                });
            } else {
                const PatientWithFormattedBirthday = {
                    ...editedPatient,
                    birthday: format(new Date(editedPatient.birthday), 'yyyy-MM-dd'),
                };

                await axios.put(`${PATIENTS_API_URL}/${editedPatient.id}/`, PatientWithFormattedBirthday);

                updatePatient(PatientWithFormattedBirthday);

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Patient updated successfully',
                    life: 3000,
                });
            }

            setDisplayDialog(false);
            setIsAddingNew(false);
        } catch (error) {
            console.error('Error saving patient:', error.response.data);
        }
    };

    const handleHide = () => {
        setDisplayDialog(false);
        setIsAddingNew(false);
    };

    const renderActions = (rowData) => {
        const menuLeft = useRef(null);
        const items = [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => handleEdit(rowData),
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => showConfirmDialog(rowData),
            },
        ];

        return (
            <div>
                <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
                <Button
                    icon="pi pi-ellipsis-h"
                    onClick={(event) => menuLeft.current.toggle(event)}
                    aria-controls="popup_menu_left"
                    aria-haspopup
                    rounded
                    outlined
                    severity="secondary"
                />
            </div>
        );
    };

    const accept = async () => {
        try {
            await axios.delete(`${PATIENTS_API_URL}/${selectedPatient.id}/`);

            setPatients((prevPatients) =>
                prevPatients.filter((patient) => patient.id !== selectedPatient.id)
            );

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Patient deleted successfully',
                life: 3000,
            });
        } catch (error) {
            console.error('Error deleting patient:', error);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete patient',
                life: 3000,
            });
        }

        setConfirmDialogVisible(false);
    };

    const reject = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'Delete action cancelled',
            life: 3000,
        });

        setConfirmDialogVisible(false);
    };

    const showConfirmDialog = (rowData) => {
        setSelectedPatient(rowData);
        setConfirmDialogVisible(true);
    };

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    return (
        <div className="card">
            <div className="card toolbarCard">
                <Toolbar start={renderHeader()} end={renderAddNew()} className='ToolBar'></Toolbar>
            </div>

            <div className="card tableCard">
                <DataTable
                    value={patients}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="row"
                    loading={loading}
                    globalFilterFields={Object.keys(filters)}
                    emptyMessage="No patients found."
                    selectionMode="single"
                    onSelectionChange={onRowSelect}
                >
                    {dynamicColumns}
                    <Column key="actions" body={renderActions} header="Actions" style={{ textAlign: 'center' }} />
                </DataTable>
            </div>

            <Dialog header={editedPatient ? "Edit Patient" : "Add New Patient"} visible={displayDialog} onHide={handleHide}>
                {editedPatient && (
                    <div className="card flex justify-content-center" style={{ padding: '10px' }}>
                        <div className="p-field my-input-field">
                            <span className="p-float-label" style={{ marginBottom: '10px' }}>
                                <InputText id="last_name" name="last_name" value={editedPatient.last_name} onChange={handleInputChange} className="p-inputtext" />
                                <label htmlFor="last_name">Last Name</label>
                            </span>
                        </div>
                        <div className="p-field my-input-field">
                            <span className="p-float-label">
                                <InputText id="first_name" name="first_name" value={editedPatient.first_name} onChange={handleInputChange} className="p-inputtext" />
                                <label htmlFor="first_name">First Name</label>
                            </span>
                        </div>
                        <div className="p-field my-input-field">
                            <span className="p-float-label">
                                <InputText id="middle_name" name="middle_name" value={editedPatient.middle_name} onChange={handleInputChange}
                                    className="p-inputtext" />
                                <label htmlFor="middle_name">Middle Name</label>
                            </span>
                        </div>
                        <div className="p-field my-input-field">
                            <span className="p-float-label">
                                <Dropdown
                                    id="gender"
                                    name="gender"
                                    value={editedPatient.gender}
                                    options={genderOptions}
                                    onChange={handleInputChange}
                                    placeholder="Select Gender"
                                />
                                <label htmlFor="gender">Gender</label>
                            </span>
                        </div>
                        <div className="p-field my-input-field">
                            <span className="p-float-label">

                                <Calendar
                                    id="birthday"
                                    name="birthday"
                                    value={editedPatient.birthday}
                                    onChange={handleInputChange}
                                    showIcon
                                />
                                <label htmlFor="birthday">Birthday</label>
                            </span>
                        </div>
                        <div className="p-field">
                            <span className="p-float-label">
                                <Dropdown
                                    id="ward_name"
                                    name="ward_name"
                                    value={editedPatient.ward_name}
                                    options={wardNames.map(ward => ({ label: ward.ward_name, value: ward.id }))}
                                    onChange={handleInputChange}
                                    placeholder="Select Ward Name"
                                />
                                <label htmlFor="ward_name">Ward Name</label>
                            </span>
                        </div>
                        {/* Add more input fields or customize as needed */}

                    </div>
                )
                }
                <div className="p-dialog-footer">
                    <Button label="Save" icon="pi pi-check" onClick={handleSave} />
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-danger" />
                </div>
            </Dialog >

            <div className="card justify-content-center">
                <ConfirmPopup
                    ref={confirmPopupRef}
                    target={document.body}
                    visible={confirmDialogVisible}
                    onHide={() => setConfirmDialogVisible(false)}
                    message="Are you sure you want to delete this patient?"
                    icon="pi pi-exclamation-triangle"
                    accept={accept}
                    reject={reject}
                />
            </div>

            <Toast ref={toast} />
        </div >
    );
}

export default DataTableWithModal;