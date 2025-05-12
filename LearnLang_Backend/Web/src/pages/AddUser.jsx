import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddAdmin(){
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    file: null,
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('file', data.file);

    axios
      .post('http://localhost:5000/addUser', formData)
      .then((res) => {
        if (res.data.status === 'Success') {
          navigate('/user');
        } 
      })
      .catch((error) => {
        if (error.response.data.status === 'Error') {
          setError(error.response.data.msg);
        } 
      });
  };

  
    return(
        <div className='d-flex justify-content-center textstyle row'>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-3 textstyle fw-bold fs-5 d-flex'>Create User</h2>
           
            <form className='row g-3 w-50' onSubmit={handleAddUser}>
                <div className='col-12'>
                    <label htmlFor='inputName' className='fs-4 form-label'>Name</label>
                    <input type='text' className='form-control' id='inputName' placeholder='Enter Name'
                    autoComplete='off' onChange={e => setData({...data, name: e.target.value})}/>
                </div>
                <div className='col-12'>
                    <label htmlFor='inputEmail' className='fs-4 form-label'>Email</label>
                    <input type='email' className='form-control' id='inputEmail' placeholder='Enter Email'
                    autoComplete='off' onChange={e => setData({...data, email: e.target.value})}/>
                </div>
                <div className='col-12'>
                    <label htmlFor='inputPassword' className='fs-4 form-label'>Password</label>
                    <input type='text' className='form-control' id='inputPassword' placeholder='Enter Password'
                    autoComplete='off' onChange={e => setData({...data, password: e.target.value})}/>
                </div>
                
                <div className='col-12'>
                    <label htmlFor='insertImage' className='fs-4 form-label'>Image Profile</label>
                    <input type='file' className='form-control' id='insertImage' placeholder='Insert Image'
                        onChange={e => setData({...data, file: e.target.files[0] })}/>
                    </div>
                <div className="text-danger">
                {error && error}
                </div>
                <div className='col-12 mt-5 mb-5 d-flex'>
                    <button className='align-items-center btn ms-1  buttonstyle '>Create User</button>
                    
                </div>
            </form>
        </div>
    )
}