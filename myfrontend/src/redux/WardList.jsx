
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { fetchWards, deleteWard, updateWard, addWard } from './wardsSlice';
// import { fetchWards, deleteWard, updateWard, addWard } from '../features/wardsSlice';
import WardModal from './WardModal';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const WardList = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const wards = useSelector((state) => state.wards.wards);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchWards());
  }, [dispatch]);
  // const deleteHandler = (wardId) => {
  //   dispatch(deleteWard(wardId));
  // };
  
  const handleDelete = (rowData) => {
    console.log('rowData:', rowData);
    setSelectedWard(rowData);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const wardId = selectedWard.id;
      dispatch(deleteWard(wardId));
      toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Ward Deleted successfully' });
    } catch (error) {
      console.error('Error deleting ward:', error);
      toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Error Deleting ward' });
    } finally {
      setDeleteConfirmationVisible(false);
    }
  };
  const cancelDelete = () => {
    setSelectedWard(null);
    setDeleteConfirmationVisible(false);
  };

  const handleAdd = () => {
    setSelectedWard(null);
    setIsModalVisible(true);
  };

  const handleEdit = (ward) => {
    setSelectedWard({ ...ward });
    setIsModalVisible(true);
  };

  const onSubmitHandler = async (ward) => {
    if (selectedWard && selectedWard.id) {
      // dispatch(updateWard({ ...selectedWard, ...ward }));
      try {
        dispatch(updateWard({ ...selectedWard, ...ward }));
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Ward Updated successfully',
        });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Error Updating ward',
        });
      }
    } else {
      // dispatch(addWard(ward));
      try {
        dispatch(addWard(ward));
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Ward added successfully',
        });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Error adding ward',
        });
      }
    }
    setIsModalVisible(false);
  };
  
  return (
    <div>
      <Button label="Add Ward" icon="pi pi-plus" onClick={handleAdd} />
      <DataTable value={wards}>
        <Column field="ward_name" header="Ward Name" />
        <Column body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className=" p-button-success" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />
            </div> )} />
      </DataTable>
      <WardModal visible={isModalVisible} onHide={() => setIsModalVisible(false)} onSubmit={onSubmitHandler} ward={selectedWard} 
      
      />
      <Dialog
        header="Confirmation"
        visible={isDeleteConfirmationVisible}
        style={{ width: '25vw' }}
        modal
        onHide={cancelDelete}
        footer={
          <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={cancelDelete} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={confirmDelete} />
          </>
        }
      >
        Are you sure you want to delete this ward?
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
};

export default WardList;
