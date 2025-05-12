import React, { useState } from 'react'
import axios from 'axios'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'


export default function AddArticle (){
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [data, setData] = useState({
    title: null,
    writerBy: null,
    file: null,
    image: null,
  })

  const handleAddArticle = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('writerBy', data.writerBy)
    formData.append('file', data.file)
    formData.append('image', data.image)

    axios
      .post('http://localhost:5000/addArtikel', formData)
      .then((res) => {
        if (res.data.status === 'Success') {
          navigate('/article')
        } else {
          navigate('/article')
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.status === 'Error') {
          setError(error.response.data.msg)
        } else {
          setError('Error Create')
        }
      });
  };
    
    return(
        <div className='d-flex justify-content-center textstyle row'>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-3 textstyle fw-bold fs-5 d-flex'>Create Article</h2>
           
            <form className='row g-3 w-50' onSubmit={handleAddArticle}>
                <div className='col-12'>
                    <label for='inputTitle' className='fs-4 form-label'>Title</label>
                    <input type='text' className='form-control' id='inputTitle' placeholder='Enter Title'
                    autoComplete='off' 
                    onChange={e => setData({...data, title: e.target.value})}
                    />
                </div>
                <div className='col-12'>
                    <label for='writerBy' className='fs-4 form-label'>Writer By</label>
                    <input type='text' className='form-control' id='writerBy' placeholder='Enter Writer By'
                    autoComplete='off' 
                    onChange={e => setData({...data, writerBy: e.target.value})}
                    />
                </div>
                <div className='col-12'>
                    <label for='content' className='fs-4 form-label'>Content</label>
                    <input type='file' className='form-control' id='content' 
                    autoComplete='off' 
                    onChange={e => setData({...data, file: e.target.files[0]})}
                    />
                </div>
                <div className='col-12'>
                    <label for='image' className='fs-4 form-label'>Image</label>
                    <input type='file' className='form-control' id='image' 
                    autoComplete='off' 
                    onChange={e => setData({...data, image: e.target.files[0]})}
                    />
                </div>
                <div className="text-danger">
                {error && error}
                </div>
                <div className='col-12 mt-5 mb-5 d-flex'>
                    <button className='align-items-center btn ms-1  buttonstyle '>Create Article</button>
                    
                </div>
            </form>
        </div>
    )
    }

