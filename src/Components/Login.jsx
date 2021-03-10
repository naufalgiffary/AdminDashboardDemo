import React, { useState } from 'react'
import './Login.css'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const Login = () => {
    const [username, setuser] = useState("")
    const [password, setpass] = useState("")
    const History = useHistory()

    const onUserChange = (e) => {
        setuser(e.target.value)
    }

    const onPassChange = (e) => {
        setpass(e.target.value)
    }

    const loginBut = (e) => {
        e.preventDefault()
        Axios.post('https://devapi.kmdcargo.com/users/login', {
            loginid: username,
            password: password
        }).then((res) => {
            Cookies.set('token', res.data.data.access_token, { expires: 1 })
            localStorage.setItem('name', JSON.stringify(res.data.data.name))
            History.push('/')
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User tidak ditemukan!',
                footer: 'Hubungi admin'
            })
        })
    }

    return (
        <div class="log-form">
            <h2>Login to your account</h2>
            <form onSubmit={loginBut}>
                <input onChange={(e) => onUserChange(e)} type="text" title="username" placeholder="username" />
                <input onChange={(e) => onPassChange(e)} type="password" title="username" placeholder="password" />
                <button style={{backgroundColor: 'gray'}} onSubmit={loginBut} type="submit" className="btn">Login</button>
                <Link to='/register'>
                    <h4>Belum punya akun?</h4>
                </Link>
            </form>
        </div>
    )
}

export default Login;