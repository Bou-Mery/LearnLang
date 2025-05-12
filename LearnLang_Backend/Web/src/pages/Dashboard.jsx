import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import image from '../assets/VoiceLearn.png'
import axios from 'axios';



export default function Dashboard(){

    const navigate = useNavigate()

    const checkAuthCookie = () => {
        return document.cookie.includes('jwt=');
      };
      
      useEffect(() => {
        const checkData = async () => {
          if (checkAuthCookie()) {
            try {
              const response = await axios.get('http://localhost/home');
              if (response.data.status === 'Success') {
                document.cookie = `jwt=${response.data.token}; path=/; secure`;
                navigate('/');
              } else {
                console.log(error);
              }
            } catch (error) {
              console.log(error.response.data);
              navigate('/login');
            }
          } else {
            console.log(error)
          }
        };
      
        checkData();
      }, []);


      const handlelogout = () => {
          axios.delete('http://localhost:5000/logoutAdmin')
          .then((res) => {
              navigate('/login')
          })
      }
    return(
        <div class="container-fluid ">
            <div class="row flex-nowrap ">
                <div class="col-auto bg col-md-3 col-xl-2 px-sm-1 px-0 ">
                    <div class="d-flex flex-column align-items-center align-items-sm-start px-2 pt-2 textSidebar min-vh-100">
                        <div class="d-flex align-items-center ms-4 mt-3 pb-4 mb-md-0 me-md-auto textSidebar text-decoration-underline">
                            <span class="fs-4 fw-bold  d-none textSidebar d-sm-inline"></span>
                        </div>
                        <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li class="nav-item">
                                <Link to='/' class="textSidebar nav-link align-middle px-0 " >
                                    <i class="fs-4 bi-house"></i> <span class="ms-1 d-none d-sm-inline">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/user' data-bs-toggle="collapse" class="textSidebar  nav-link px-0 align-middle">
                                    <i class="fs-4 bi bi-person"></i> <span class="ms-1 d-none d-sm-inline">Data User</span> </Link>
                                
                            </li>
                            <li>
                                <Link to='/quiz' data-bs-toggle="collapse" class="textSidebar nav-link px-0 align-middle">
                                    <i class="fs-4 bi-cassette"></i> <span class="ms-1 d-none d-sm-inline">Data Quiz</span> </Link>
                                
                            </li>
                    
                            <li>
                                <Link to='/article' data-bs-toggle="collapse" class="textSidebar nav-link px-0 align-middle">
                                    <i class="fs-4 bi-journal-check"></i> <span class="ms-1 d-none d-sm-inline">Data Article</span> </Link>
                                
                            </li>
                            <li>
                                <Link to='/login' data-bs-toggle="collapse" class="textSidebar  nav-link px-0 align-middle" onClick={handlelogout}>
                                    <i class="fs-4 bi-box-arrow-in-left"></i> <span class="ms-1 d-none d-sm-inline" >Log Out</span> </Link>
                                
                            </li>
                            </ul>
                    </div>
                </div>
                <div class="col p-0 m-0">
                        <div className='textStyle d-flex align-items-center'>
                            <img src={image} className="ps-5  logoStyle"/>
                        </div>
                    <Outlet />
                </div>
            </div>
</div>
    )
}