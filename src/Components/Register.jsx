import React, { useState } from 'react'
import './Login.css'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Axios from 'axios'


const Register = () => {
    const [username, setuser] = useState("")
    const [useraddress, setaddress] = useState("")
    const [userphone, setphone] = useState("")
    const [useremail, setemail] = useState("")
    const History = useHistory()

    const regisBut = (e) => {
        e.preventDefault()
        Axios.post('https://devapi.kmdcargo.com/users/login', {
            name: username,
            address: useraddress,
            phone: userphone,
            email: useremail,
        }).then((res) => {
            Cookies.set('token', res.data.data.access_token)
            localStorage.setItem('name', JSON.stringify(res.data.data.name))
            let timerInterval
            Swal.fire({
                title: 'Berhasil Register! Tunggu konfirmasi email dari admin!',
                // html: '<b></b> milliseconds.',
                timer: 5000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    History.push('/login')
                }
            })
        })


    }

    const onUserChange = (e) => {
        setuser(e.target.value)
    }

    const onEmailChange = (e) => {
        setemail(e.target.value)
    }

    const onPhoneChange = (e) => {
        setphone(e.target.value)
    }

    const onAddressChange = (e) => {
        setaddress(e.target.value)
    }

    return (
        <div class="log-form">
            <h2>Register your account</h2>
            <form onSubmit={regisBut}>
                <input onChange={(e) => onUserChange(e)} type="text" title="username" placeholder="nama" />
                <input onChange={(e) => onEmailChange(e)} type="text" title="email" placeholder="email" />
                <input onChange={(e) => onPhoneChange(e)} type="text" title="phone" placeholder="no handphone" />
                <input onChange={(e) => onAddressChange(e)} type="text" title="address" placeholder="alamat" />
                <button style={{backgroundColor: 'gray'}} onSubmit={regisBut} type="submit" className="btn">Register</button>
                <Link to='/login'>
                    <h4>Sudah ada akun?</h4>
                </Link>
            </form>
        </div>
    )
}

export default Register;