import React, { useEffect, useState } from 'react'
import './style.css'
import { Button, Form, Input } from 'reactstrap';
import HeaderUpload from '../View/HeaderUpload'
import Axios from 'axios'
import SideMenu from '../View/Sidemenu'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';

const UploadResi = () => {
    const [files, setfile] = useState(null)
    var tokenCook = Cookies.get('token')
    const History = useHistory()

    const onFileChange = (e) => {
        if (e.target.files[0]) {
            setfile(e.target.files[0])
        } else {
            setfile(null)
        }
    }

    useEffect(()=> {
        if (!tokenCook) {
            History.push('/login')
        }
    },[])

    const uploadRes = () => {
        const importantdata = new FormData()
        importantdata.append('document', files)
        Axios.post('https://devapi.kmdcargo.com/orders/excel', importantdata, {
            headers: {
                "Authorization": `Bearer ${tokenCook}`,
            }
        })
            .then(() => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'File berhasil di upload',
                    showConfirmButton: false,
                    timer: 1500
                  })
            }).catch((err) => console.log(err))
    }

    return (
        <>
            <HeaderUpload />
            <SideMenu />
            <div className="mainsection">
                <div style={{ fontWeight: 'bolder', marginBottom: '10px', fontSize: '20px' }}>
                    Upload Resi
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Input type="file" onChange={onFileChange} style={{ border: '1px solid black' }} />
                </div>
                <Button onClick={uploadRes} style={{ background: 'gray', border: 'none', width: '150px', height: '50px', marginBottom: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bolder' }}>
                    Upload Resi
            </Button>
            </div>
        </>
    )
}

export default UploadResi