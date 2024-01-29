// import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';

// const WardForm = ({ onSubmit, ward, onHide }) => {
//   const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
//     defaultValues: {
//       ward_name: ward ? ward.ward_name : '',
//     },
//   });

//   const onSubmitHandler = (data) => {
//       reset();
//     onSubmit(data);
//   };
//   const onCancel = () => {
//     reset();
//     onHide();
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmitHandler)}>
//         <div className="p-field">
//           <label htmlFor="ward_name">Ward Name</label>
//           <div className="p-inputgroup">
//             <Controller
//               name="ward_name"
//               control={control}
//               rules={{
//                 required: 'Ward Name is required',
//                 maxLength: {
//                   value: 50,
//                   message: 'Ward Name should not exceed 50 characters',
//                 },
//               }}
//               render={({ field }) => (
//                 <InputText
//                   id="ward_name"
//                   {...field}
//                   onChange={(e) => {
//                     setValue('ward_name', e.target.value);
//                     field.onChange(e);
//                   }}
//                   className={errors.ward_name ? 'p-invalid' : ''}
//                 />
//               )}
//             />
//           </div>
//           {errors.ward_name && <small className="p-error">{errors.ward_name.message}</small>}
//         </div><br></br>
//         <div className="p-field form-actions">
//           <Button label="Save" type="submit" className="p-button-success" /> 
//           <Button label="Cancel" onClick={onCancel} className="p-button-secondary" />
//         </div>
//       </form>
//     </div>
//   );
// };

// const WardModal = ({ visible, onHide, onSubmit, ward }) => {
//   return (
//     <div>
//       <Dialog header={ward ? 'Edit Ward' : 'Add Ward'} visible={visible} onHide={onHide} modal style={{ width: '400px' }}>
//         <WardForm onSubmit={onSubmit}  ward={ward} />
//       </Dialog>
//     </div>
//   );
// };

// export default WardModal;


// import React from 'react';
import React, { useState, useEffect, useRef } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
const WardModal = ({ visible, onHide, onSubmit, ward}) => {
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      ward_name: ward ? ward.ward_name : '',
    },
  });
  const onCancel = () => {
    reset();
    onHide();
  };
  const onSubmitHandler = (data) => {
    reset();
    onSubmit(data);
  };
  useEffect(() => {
    // Update the value when the 'ward' prop changes
    setValue('ward_name', ward ? ward.ward_name : '');
  }, [ward, setValue]);
  return (
    <div>
      <Dialog header={ward ? 'Edit Ward' : 'Add Ward'} onHide={onCancel} visible={visible} modal style={{ width: '400px' }}
      footer = {
        <div className="p-field form-actions">
        <Button label="Save" type="submit" className="p-button-success" onClick={handleSubmit(onSubmitHandler)}/> 
        <Button label="Cancel" onClick={onCancel} className="p-button-secondary" />
      </div>}>
        {/* <WardForm onSubmit={onSubmit}  ward={ward} onHide={onHide}/> */}
        <form ward={ward}>
        <div className="p-field">
          <label htmlFor="ward_name">Ward Name</label>
          <div className="p-inputgroup">
            <Controller
              name="ward_name"
              control={control}
              rules={{
                required: 'Ward Name is required',
                maxLength: {
                  value: 50,
                  message: 'Ward Name should not exceed 50 characters',
                },
              }}
              render={({ field }) => (
                <InputText
                  id="ward_name"
                  {...field}
                  // onChange={(e) => {
                  //   setValue('ward_name', e.target.value);
                  //   field.onChange(e);
                  // }}
                  className={errors.ward_name ? 'p-invalid' : ''}/>)}/>
          </div>
          {errors.ward_name && <small className="p-error">{errors.ward_name.message}</small>}
        </div><br></br>
       
      </form>
      </Dialog>
    </div>
  );
};

export default WardModal;