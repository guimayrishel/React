import React, { useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from 'primereact/dialog';
import { useCreateDoctorMutation, useUpdateDoctorMutation } from "../../services/Doctor";

export default function WardForm({ visible, onHide, doctor }) {
 const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { 
      firstname: doctor ? doctor.firstname : '',
      middlename: doctor ? doctor.middlename : '',
      lastname: doctor ? doctor.lastname : '',
      licensenumber: doctor ? doctor.licensenumber : '',
      suffix: doctor ? doctor.suffix : '',
    },
 });

 const [createDoctorMutation, { isLoading: isCreating }] = useCreateDoctorMutation();
 const [updateDoctorMutation, { isLoading: isUpdating }] = useUpdateDoctorMutation();
 const toast = useRef(null);

 useEffect(() => {
  if (doctor) {
    setValue('firstname', doctor ? doctor.firstname : '',);
    setValue('middlename', doctor ? doctor.middlename : '',);
    setValue('lastname', doctor ? doctor.lastname : '',);
    setValue('licensenumber', doctor ? doctor.licensenumber : '',);
    setValue('suffix', doctor ? doctor.suffix : '',);
  }
 }, [doctor, setValue]);

 const onCancel = () => {
    reset();
    onHide();
 };

 const saveDoctor = (data) => {
  const mutation = doctor && doctor.id ? updateDoctorMutation({id: doctor.id, patch: data}) : createDoctorMutation(data);
    mutation .unwrap()
      .then(() => {
        toast.current.show({ severity: "success", summary: "Successful", detail: `Doctor ${doctor ? 'Updated' : 'Added'}`, life: 3000 });
        reset();
    onHide();
      })
      .catch(() => {
        toast.current.show({ severity: "error", summary: "Error", detail: `Failed to ${doctor ? 'update' : 'create'} Doctor`, life: 3000 });
      });
 };

 const getFormErrorMessage = (name) => (
    <small className="p-error">{errors[name] ? errors[name].message : '\u00A0'}</small>
 );
 return (
    <div>
      <Toast ref={toast} />
      <Dialog
 header={doctor ? 'Edit Doctor' : 'Add Doctor'}
 onHide={onCancel}
 visible={visible}
 modal
 style={{ width: '400px' }}
 footer={
    <div className="p-field form-actions">
      <Button label="Save" type="submit" className="p-button-success" onClick={handleSubmit(saveDoctor)} />
      <Button label="Cancel" onClick={onCancel} className="p-button-secondary" />
    </div>
 }
><br></br>
        <form doctor={doctor}>
        
    <Controller
      name="firstname"
      control={control}
      rules={{ required: "Doctor Name is required." }}
      render={({ field, fieldState }) => (
        <>
          <div className="p-field">
  <div className="p-inputgroup"><br></br>
  <label htmlFor={field.firstname} className={fieldState.error ? "p-error" : ""}></label>
          <span className={`p-float-label ${fieldState.error ? "p-error" : ""}`}>
            <InputText
              id={field.firstname}
              value={field.value}
              className={`p-inputtext-sm ${fieldState.error ? "p-invalid" : ""}`}
              onChange={(e) => field.onChange(e.target.value)}
            />
      
            <label htmlFor={field.firstname}>Doctor Name</label>
            </span>
            </div>
</div>
         
          {getFormErrorMessage(field.name)}
        </>
      )}
    />
   <br></br>
    <Controller
      name="middlename"
      control={control}
      rules={{ required: "Middle Name is required." }}
      render={({ field, fieldState }) => (
        <>
          <div className="p-field">
  <div className="p-inputgroup">
  <label htmlFor={field.middlename} className={fieldState.error ? "p-error" : ""}></label>
          <span className={`p-float-label ${fieldState.error ? "p-error" : ""}`}>
            <InputText
              id={field.middlename}
              value={field.value}
              className={`p-inputtext-sm ${fieldState.error ? "p-invalid" : ""}`}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <label htmlFor={field.middlename}>Middle Name</label>
            </span>
            </div>
</div>
         
          {getFormErrorMessage(field.name)}
        </>
      )}
    />
    <Controller
      name="lastname"
      control={control}
      rules={{ required: "Last Name is required." }}
      render={({ field, fieldState }) => (
        <>
          <div className="p-field">
  <div className="p-inputgroup">
  <label htmlFor={field.lastname} className={fieldState.error ? "p-error" : ""}></label>
          <span className={`p-float-label ${fieldState.error ? "p-error" : ""}`}>
            <InputText
              id={field.lastname}
              value={field.value}
              className={`p-inputtext-sm ${fieldState.error ? "p-invalid" : ""}`}
              onChange={(e) => field.onChange(e.target.value)}
            />
      
            <label htmlFor={field.lastname}>Last Name</label>
            </span>
            </div>
</div>
         
          {getFormErrorMessage(field.name)}
        </>
      )}
    />
   <Controller
  name="licensenumber"
  control={control}
  rules={{
    required: "License Number is required.",
    pattern: {
      value: /^[0-9]+$/,
      message: "License Number must contain only numbers.",
    },
  }}
  render={({ field, fieldState }) => (
    <>
      <div className="p-field">
        <div className="p-inputgroup">
          <label htmlFor={field.name} className={fieldState.error ? "p-error" : ""}></label>
          <span className={`p-float-label ${fieldState.error ? "p-error" : ""}`}>
            <InputText
              id={field.name}
              value={field.value}
              className={`p-inputtext-sm ${fieldState.error ? "p-invalid" : ""}`}
              onChange={(e) => field.onChange(e.target.value)}
            />

            <label htmlFor={field.name}>License Number</label>
          </span>
        </div>
      </div>

      {getFormErrorMessage(field.name)}
    </>
  )}
/>

<Controller
      name="suffix"
      control={control}
      rules={{ required: "Suffix is required." }}
      render={({ field, fieldState }) => (
        <>
          <div className="p-field">
  <div className="p-inputgroup">
  <label htmlFor={field.suffix} className={fieldState.error ? "p-error" : ""}></label>
          <span className={`p-float-label ${fieldState.error ? "p-error" : ""}`}>
            <InputText
              id={field.suffix}
              value={field.value}
              className={`p-inputtext-sm ${fieldState.error ? "p-invalid" : ""}`}
              onChange={(e) => field.onChange(e.target.value)}
            />
      
            <label htmlFor={field.suffix}>Suffix</label>
            </span>
            </div>
</div>
         
          {getFormErrorMessage(field.name)}
        </>
      )}
    />
        </form>
      </Dialog>
    </div>
 );
}
