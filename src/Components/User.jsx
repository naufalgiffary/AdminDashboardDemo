import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios'
import SideMenu from '../View/Sidemenu'
import HeaderUser from '../View/HeaderUser'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'gray',
        '&:hover': {
            backgroundColor: 'gainsboro',
        },
        marginRight: theme.spacing(70),
        marginTop: '5px',
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '35ch',
        },
    }
}));

const Users = (props) => {
    const classes = useStyles();
    const [userData, setuserData] = useState([])
    const [totalUser, settotalUser] = useState(null)
    const [find, setFind] = useState('')
    const [filterPerson, setfilterPerson] = useState([])
    const History = useHistory()
    const [modaledit, setModaledit] = useState(false);
    const [indexedit, setindexedit] = useState(0)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    var tokenCook = Cookies.get('token')

    useEffect(() => {
        if (!tokenCook) {
            History.push('/login')
        }
        Axios.get('https://devapi.kmdcargo.com/users', {
            headers: {
                "Authorization": `Bearer ${tokenCook}`
            }
        })
            .then((res) => {
                console.log(res.data.data);
                setuserData(res.data.data)
                settotalUser(res.data.data.length)
            }).catch((err) => console.log(err))
    }, [])


    const [editform, seteditform] = useState({
        namauser: useRef(),
        emailuser: useRef(),
        phoneuser: useRef(),
        addressuser: useRef(),
        ktpuser: useRef(),
        markuser: useRef(),
        passuser: useRef(),
        activeuser: useRef(),
    })

    useEffect(() => {
        const getFindData = (data) => {
            if (data) {
                let reduxPeople = userData
                var validperson = reduxPeople.filter((val, ind) => {
                    return val.email.toLocaleLowerCase().includes(data)
                })
                console.log(validperson);
                setfilterPerson(validperson)
            } else {
                setfilterPerson('')
            }
        }
        getFindData(find)
    }, [find, userData])

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

    const onEditClick = (index) => {
        console.log(index);
        setindexedit(index)
        setModaledit(true)
    }

    const onSaveeditClick = (dataID) => {
        var mark = editform.markuser.current.value
        var password = editform.passuser.current.value
        var name = editform.namauser.current.value
        var address = editform.addressuser.current.value
        var phone = editform.phoneuser.current.value
        var email = editform.emailuser.current.value
        var ktp = editform.ktpuser.current.value
        var active = editform.activeuser.current.value == 'true'

        var obj
        if(password) {
            obj = { mark, password, name, address, phone, email, ktp, active }
        } else {
            obj = { mark, name, address, phone, email, ktp, active }
        }

        console.log(obj);

        Axios.put(`https://devapi.kmdcargo.com/users/${dataID}`, obj, {
            headers: {
                "Authorization": `Bearer ${tokenCook}`
            }
        })
            .then(() => {
                Axios.get('https://devapi.kmdcargo.com/users', {
                    headers: {
                        "Authorization": `Bearer ${tokenCook}`
                    }
                })
                    .then((res) => {
                        console.log(res.data.data);
                        setuserData(res.data.data)
                        settotalUser(res.data.data.length)
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `${res.data.message}`,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setModaledit(false)
                    }).catch((err) => console.log(err))
            }).catch((err) => console.log(err))
    }

    const renderTable = () => {
        let allData
        if (!filterPerson) {
            let reduxPeople = userData
            allData = reduxPeople.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.name}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.email}
                            </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.address}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.ktp ? user.ktp : "*******"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.mark ? user.mark : "belum ada"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.password ? user.password : "*******"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto', boxSizing: 'border-box', backgroundColor: user.active ? 'lime' : 'gainsboro' }}>
                                {user.active ? "Sudah di Acc" : "Belum di Acc"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                <Button onClick={() => onEditClick(index)}>Edit</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )
            })
        } else {
            allData = filterPerson.map((user, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.name}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.email}
                            </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.address}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.ktp ? user.ktp : "*******"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.mark ? user.mark : "belum ada"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                {user.password ? user.password : "*******"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto', boxSizing: 'border-box', backgroundColor: user.active ? 'lime' : 'gainsboro' }}>
                                {user.active ? "Sudah di Acc" : "Belum di Acc"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ width: 'auto' }}>
                                <Button onClick={() => onEditClick(index)}>Edit</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )
            })
        }
        return allData
    }

    const toggleedit = () => setModaledit(!modaledit);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            {
                userData.length ?
                    filterPerson.length ?
                        <div style={{ background: 'linear-gradient(180deg, #6bfefe81 10%, #fafafa 70%)' }}>
                            <Modal isOpen={modaledit} toggle={toggleedit} >
                                <ModalHeader toggle={toggleedit}>edit data {filterPerson.length ? filterPerson[indexedit].name : ''}</ModalHeader>
                                <ModalBody>
                                    <input type='text' defaultValue={filterPerson[indexedit].name} ref={editform.namauser} placeholder='Masukkan Nama' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].email} ref={editform.emailuser} placeholder='Masukkan Email' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].phone} ref={editform.phoneuser} placeholder='Masukkan nomor handphone' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].address} ref={editform.addressuser} placeholder='Masukkan alamat' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].ktp} ref={editform.ktpuser} placeholder='Masukkan ktp' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].mark} ref={editform.markuser} placeholder='Masukkan kode mark' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].password} ref={editform.passuser} placeholder='Masukkan password' className='form-control mb-2' />
                                    <input type='text' defaultValue={filterPerson[indexedit].active} ref={editform.activeuser} placeholder='Masukkan status (true/false)' className='form-control mb-2' />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => onSaveeditClick(filterPerson[indexedit].data_id)}>Simpan/Ubah</Button>
                                    <Button color="secondary" onClick={toggleedit}>Batal</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                        :
                        <Modal isOpen={modaledit} toggle={toggleedit} >
                            <ModalHeader toggle={toggleedit}>edit data {userData.length ? userData[indexedit].name : ''}</ModalHeader>
                            <ModalBody>
                                <input type='text' defaultValue={userData[indexedit].name} ref={editform.namauser} placeholder='Masukkan Nama' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].email} ref={editform.emailuser} placeholder='Masukkan Email' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].phone} ref={editform.phoneuser} placeholder='Masukkan nomor handphone' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].address} ref={editform.addressuser} placeholder='Masukkan alamat' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].ktp} ref={editform.ktpuser} placeholder='Masukkan ktp' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].mark} ref={editform.markuser} placeholder='Masukkan kode mark' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].password} ref={editform.passuser} placeholder='Masukkan password' className='form-control mb-2' />
                                <input type='text' defaultValue={userData[indexedit].active} ref={editform.activeuser} placeholder='Masukkan status (true/false)' className='form-control mb-2' />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={() => onSaveeditClick(userData[indexedit].data_id)}>Simpan/Ubah</Button>
                                <Button color="secondary" onClick={toggleedit}>Batal</Button>
                            </ModalFooter>
                        </Modal>
                    :
                    null
            }
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
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Cari dengan Email"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => setFind(e.target.value.toLocaleLowerCase())}
                        />
                    </div>
                    <div className="loginside">
                        <div onClick={logOut} className="welcome hidewelcome">Halo, <span className='blockname'>{userName}</span></div>
                    </div>
                </div>
            </div>
            <SideMenu />
            <div className="mainsection">
                <div style={{ fontWeight: 'bolder', marginBottom: '10px' }}>
                    Menampilkan {totalUser}
                </div>
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table" style={{ width: "auto", tableLayout: "auto" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableStyle'>Nama</TableCell>
                                    <TableCell className='tableStyle'>Email</TableCell>
                                    <TableCell className='tableStyle'>Nomor HP</TableCell>
                                    <TableCell className='tableStyle'>Alamat</TableCell>
                                    <TableCell className='tableStyle'>KTP</TableCell>
                                    <TableCell className='tableStyle'>Kode Marking</TableCell>
                                    <TableCell className='tableStyle'>Password</TableCell>
                                    <TableCell className='tableStyle'>Status</TableCell>
                                    <TableCell className='tableStyle'>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderTable()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={userData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </>
    )
}

export default Users;