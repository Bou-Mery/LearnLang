import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [login, setLogin]= useState({
        email: '',
        password: ''
    });


    const navigate = useNavigate();
    
    const [error, setError] = useState('')
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/loginAdmin', login);
          if (response.data.status === 'Success') {
            const cookies = response.headers['set-cookie'];
            if (cookies && cookies.length > 0) {
              const cookieValue = cookies[0];
              document.cookie = cookieValue;
            }
            navigate('/');
          } else if (response.data.status === 'Error') {
            console.log(response.data.msg);
            navigate('/login');
          }
        } catch (error) {
          if (error.response && error.response.data.status === 'Error') {
            setError(error.response.data.msg);
          } else {
            setError('An error occurred');
          }
        }
      };
      

    return(
      <div className="bg d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light d-flex border p-5 rounded-5 flex-column" >
      <h2 className="textstyle">Hello! </h2>
      <span className=" textstyle ms-4 mb-2 mt-n2 ">VoiceLearn Admin</span>
      <form onSubmit={handleLogin}>
          <div className="textstyle mt-3">
              <label htmlFor="email">Email</label>
              <input  type="email" placeholder="Enter email" name="email" className="form-control rounded-3 mt-2"
              onChange={e => setLogin({...login, email: e.target.value})} autoComplete='off'></input>
          </div>
          <div className="textstyle mt-3">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Enter password" name="password" className="form-control mt-2 rounded-3"
              onChange={e => setLogin({...login, password: e.target.value})}></input>
          </div>
          <div className="text-danger">
              {error && error}
          </div>
          <button  type="submit" className=" buttonstyle  w-100 mt-3">Log in</button>
      </form>
      </div>
</div>
    )
}