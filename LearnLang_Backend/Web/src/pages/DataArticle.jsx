import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function DataArticle(){
    const [article, setArticle] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/listArticle')
          .then((res) => {
              if(res.data.status === "Success"){
                setArticle(res.data.row)
              }
            
          })
          .catch((err) => console.log(err));
      }, []);

      const handleDelete =(id) => {
        axios.delete(`http://localhost:5000/deleteArtikel/${id}`)
        .then((res)=>{
            if(res.data.status === "Success")
            window.location.reload();
        })
        .catch((err) => console.log(err));
      }
  
    return(
        <div>
            <h2 className='d-flex justify-content-center fs-1 mt-5 mb-5 textstyle fw-bold fs-5 d-flex'>Data Article</h2>
            <table class="table styleTable textstyle">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Writer By</th>
                    <th scope ="col">Check Content</th>
                    <th scope ="col">Images</th>
                    </tr>
                </thead>
                <tbody>
                {article.map((item, index) => (
                <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.writerBy}</td>
                    <td>{item && <i class="bi bi-card-checklist"></i>}</td>
                    <div className='ms-5'>
                    <td>
                        <div className="image-article">
                            <img src={item.imageUrl} alt="Profile" className=" img-thumbnail imgtbs" />
                        </div>
                    </td>
                    <td><button className='buttonstyle widthButton' onClick={() => handleDelete(item.id)}>Delete</button></td>
                    </div>
                    </tr>
                    ))}
                </tbody>
                </table>
                <div className='d-flex align-items-center table'>
        <Link to='/addarticle' className='w-25 customMargin mt-3 buttonstyle d-flex justify-content-center align-items-center'>Add Article</Link>
         </div>
        </div>
    )
}