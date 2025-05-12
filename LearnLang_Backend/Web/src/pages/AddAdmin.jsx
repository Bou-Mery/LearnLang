import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddAdmin(){
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [data, setData] =useState({
        name : '',
        email: '',
        password: '',
    })

    const handleAddAdmin = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/addadmin', data)
        .then((res) => {
            if(res.data.status == 'Success'){
            navigate('/')
        }else {
            navigate('/')
        }
    })
        .catch((error) => {
            if (error.response && error.response.data.status === 'Error') {
            setError(error.response.data.msg);
            } else {
            setError('An error occurred')
            }
    })
    }

  

    return(
        <div className='d-flex justify-content-center textstyle row'>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-3 textstyle fw-bold fs-5 d-flex'>Create Admin</h2>
           
            <form className='row g-3 w-50' onSubmit={handleAddAdmin}>
            
                <div className='col-12'>
                    <label for='inputEmail' className='fs-4 form-label'>Email</label>
                    <input type='text' className='form-control' id='inputEmail' placeholder='Enter Email'
                    autoComplete='off' onChange={e => setData({...data, email: e.target.value})}/>
                </div>
                <div className='col-12'>
                    <label for='inputPassword' className='fs-4 form-label'>Password</label>
                    <input type='text' className='form-control' id='inputPassword' placeholder='Enter Password'
                    autoComplete='off' onChange={e => setData({...data, password: e.target.value})}/>
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