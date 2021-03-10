import React from 'react';
import './style.css'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'

const HeaderUpload = () => {

    const logOut = () => {
        Swal.fire({
            title: 'Yakin keluar?',
            text: "Anda akan keluar dari web admin!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, keluar!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear()
                Cookies.remove('token')
                Cookies.remove('name')
                Swal.fire(
                    'Telah Keluar!',
                    'Anda telah keluar.',
                    'success'
                )
                window.location.href = window.location.origin
            }
        })
    }

    var userName = JSON.parse(localStorage.getItem('name'))
    return (
        <div className='header'>
            <div className="section">
                <div className="logoside">
                    <div className="hamburger"><span><i className="fas fa-bars"></i></span></div>
                    <div className="thelogo">
                        <div className="insidelogo">
                            <img width='100%' height='100%' alt="logo" />
                        </div>
                    </div>
                </div>
                <div className="loginside">
                    <div onClick={logOut} className="welcome hidewelcome">Halo, <span className='blockname'>{userName}</span></div>
                </div>
            </div>
        </div>
    )
}

export default HeaderUpload;