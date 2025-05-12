import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [admin, setAdmin] = useState([]);
  const [count, setCount] = useState(null);


  useEffect(() => {
      axios.get('http://localhost:5000/countUser')
      .then((res) => {
          setCount (res.data)
      })
  })
  useEffect(() => {
    axios.get('http://localhost:5000/listadmin')
      .then((res) => {
          if(res.data.status === "Success"){
            setAdmin(res.data.row)
          }
        
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete =(id) => {
    axios.delete(`http://localhost:5000/deleteadmin/${id}`)
    .then((res)=>{
        if(res.data.status === "Success")
        window.location.reload();
    })
    .catch((err) => console.log(err));
  }

  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <div className='d-flex justify-content-left align-items-center flex-column p-5 styleCard'>
        <div className='d-flex border p-5 rounded-5 mt-5 flex-column'>
          <h2 className='textstyle fs-1 '>Hello Admin</h2>
          <p className='textstyle'>
            Congratulation! Our users are now up to {count}
          </p>
        </div>
      </div>
      <div className='border rounded-5 mt-4 px-5 pt-5 mb-5 py-5 vh-50'>
        <h2 className='textstyle fw-bold fs-5 d-flex'>Data Admin</h2>
        <table className="table tableA mt-5">
          <thead className="textstyle">
            <tr className='me-3'>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
          {admin.map((item, index) => (
              <tr key={index}>
                <td>{item.email}</td>
                <td><button className='buttonstyle widthButton'  onClick={() => handleDelete(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='d-flex table'>
          <Link to='/addadmin' className='w-50 mt-3 buttonstyle d-flex justify-content-center align-items-center'>Add Admin</Link>
        </div>
      </div>
    </div>
  );
}
