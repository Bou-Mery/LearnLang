import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddSpelling(){
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [data, setData] =useState({
        text: null,
        level: '',
    })

    const handleAddQuiz = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/addSpelling', data)
        .then((res) => {
            if(res.data.status == 'Success'){
            navigate('/quiz')
        }else {
            navigate('/quiz')
        }
    })
        .catch((error) => {
            if (error.response && error.response.data.status === 'Error') {
            setError(error.response.data.msg)
            } else {
            setError('An error occurred')
            }
    })
    }

    return(
        <div className='d-flex justify-content-center textstyle row'>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-3 textstyle fw-bold fs-5 d-flex'>Create Quiz</h2>
           
            <form className='row g-3 w-50' onSubmit={handleAddQuiz}>
                <div className='col-12'>
                    <label for='inputtextAudio' className='fs-4 form-label'>Text Audio</label>
                    <input type='text' className='form-control' id='inputtextAudio' placeholder='Enter Text Audio'
                    autoComplete='off' onChange={e => setData({...data, text: e.target.value})}/>
                </div>
                <div className='col-12'>
                    <label for='inputLevel' className='fs-4 form-label'>Level</label>
                    <input type='text' className='form-control' id='inputLevel' placeholder='Enter Level'
                    autoComplete='off' onChange={e => setData({...data, level: e.target.value})}/>
                </div>
                <div className="text-danger">
                {error && error}
                </div>
                <div className='col-12 mt-5 mb-5 d-flex'>
                    <button className='align-items-center btn ms-1  buttonstyle '>Create Quiz</button>
                    
                </div>
            </form>
        </div>
    )
}