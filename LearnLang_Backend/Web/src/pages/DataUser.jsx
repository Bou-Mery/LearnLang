import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function DataUser(){
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/listuser')
          .then((res) => {
              if(res.data.status === "Success"){
                setUser(res.data.row)
              }
            
          })
          .catch((err) => console.log(err));
      }, []);

      const handleDelete =(id) => {
        axios.delete(`http://localhost:5000/deleteUser/${id}`)
        .then((res)=>{
            if(res.data.status === "Success")
            window.location.reload();
        })
        .catch((err) => console.log(err));
      }
    return(
        <div>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-5 textstyle fw-bold fs-5 d-flex'>Data User</h2>
            <table class="table styleTable textstyle">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Profile Picture</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {user.map((user, index) => (
                <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <div className="profile-image">
                            <img src={user.imageUrl} alt="Profile" className="rounded-circle img-thumbnail imgtb" />
                        </div>
                    </td>
                    <div className='ms-5'>
                    <td><button className='buttonstyle widthButton' onClick={() => handleDelete(user.id)}>Delete</button></td>
                    </div>
                    </tr>
                    ))}
                    
                </tbody>
                </table>
                <div className='d-flex align-items-center table'>
                <Link to='/adduser' className='w-25 customMargin mt-3 buttonstyle d-flex justify-content-center align-items-center'>Add User</Link>
         </div>
        </div>
    )
}