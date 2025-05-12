import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function DataQuiz(){
    const [listSpelling, setListSpelling] = useState([]);
    const [listPronunciation, setListPronunciation] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/listSpelling')
          .then((res) => {
              if(res.data.status === "Success"){
                setListSpelling(res.data.row)
              }
            
          })
          .catch((err) => console.log(err));
      }, []);

      const handleDeleteSpelling =(id) => {
        axios.delete(`http://localhost:5000/deleteSpelling/${id}`)
        .then((res)=>{
            if(res.data.status === "Success")
            window.location.reload();
        })
        .catch((err) => console.log(err));
      }

      useEffect(() => {
        axios.get('http://localhost:5000/listPronunciation')
          .then((res) => {
              if(res.data.status === "Success"){
                setListPronunciation(res.data.row)
              }
            
          })
          .catch((err) => console.log(err));
      }, []);

      const handleDeletePronunciation =(id) => {
        axios.delete(`http://localhost:5000/deletePronunciation/${id}`)
        .then((res)=>{
            if(res.data.status === "Success")
            window.location.reload();
        })
        .catch((err) => console.log(err));
      }
    return(
        <div className="tableContainer">
        <div className="customTable">
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-5 textstyle fw-bold fs-5 d-flex'>Data Spelling</h2>
            <div className='d-flex align-items-center table'>
                <Link to='/addSpelling' className=' customMargin mt-3 buttonstyle d-flex justify-content-center align-items-center'>Add Quiz</Link>
                </div>
            <table class="table styleTable textstyle">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">Text Audio</th>
                    <th scope="col">Level Quiz</th>
                    </tr>
                </thead>
                <tbody>
                {listSpelling.map((item, index) => (
                <tr key={index}>
                    <td>{item.text}</td>
                    <td>{item.level}</td>
                    <div className='ms-5'>
                    <td><button className='buttonstyle widthButton' onClick={() => handleDeleteSpelling(item.id)}>Delete</button></td>
                        </div>
                    </tr>
                ))}
                </tbody>
                </table>
                
        </div>
        <div className="customTable">
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-5 textstyle fw-bold fs-5 d-flex'>Data Pronunciation</h2>
            <div className='d-flex align-items-center table'>
                <Link to='/addPronunciation' className='w-25 customMargin mt-3 buttonstyle d-flex justify-content-center align-items-center'>Add Quiz</Link>
                </div>
            <table class="table styleTable textstyle">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">Text Audio</th>
                    <th scope="col">Level Quiz</th>
                    </tr>
                </thead>
                <tbody>
                {listPronunciation.map((item, index) => (
                <tr key={index}>
                    <td>{item.text}</td>
                    <td>{item.level}</td>
                    <div className='ms-5'>
                    <td><button className='buttonstyle widthButton' onClick={() => handleDeletePronunciation(item.id)}>Delete</button></td>
                        </div>
                    </tr>
                ))}
                </tbody>
                </table>
                
        </div>
        </div>
    )
}