import React, { useState, useEffect } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import HelmetConfig from '../shared/Helmet';

const KycModal = ({open, handleShowState, userData}) => {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const valid_id = userData?.valid_id
  const passport_photo = userData?.passport

  const handleClose = () => handleShowState(false);

  const updateKycStatus = (status) => {
    setErrMsg('');
    setSuccessMsg('');
    setLoading(true)

    const payload = {
      email: userData?.email,
      kyc_status: status
    }
    const settings = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    fetch('/.netlify/functions/updateKycStatus', settings)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setSuccessMsg('Kyc info updated successfully');
        userData.kyc_status = true;
      } else {
        setErrMsg(data.error)
      }
    })
    .catch(error => {
      console.log(error.message)
      setErrMsg(error.message)
    })
    setLoading(false);
  }

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>KYC Verification</div>
          <div>Status: {userData?.kyc_status ? 'Active' : 'Pending'}</div>
        </div>
      </Modal.Header>
      <Modal.Body className='card'>
        { successMsg && <Alert variant='success' >{successMsg}</Alert> }
        { errMsg && <Alert variant='warning' >{errMsg}</Alert> }
        <div className="row">
          <div className="col-6">
            <h3>Valid ID</h3>
            <div className="bg-secondary text-center rounded" style={{aspectRatio: '4 / 3', width: '100%'}}>
              {valid_id ? <img src={valid_id} style={{aspectRatio: '4 / 3', width: '100%'}} alt='Valid ID' /> : 'No Id card yet.' }
            </div>
          </div>
          <div className="col-6">
            <h3>Passport</h3>
            <div className="bg-secondary text-center rounded" style={{aspectRatio: '4 / 3', width: '100%'}}>
              {passport_photo ? <img src={passport_photo} style={{aspectRatio: '4 / 3', width: '100%'}} alt='Passport photo' /> : 'No passport yet.' }
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-item-center p-4">
          { userData?.kyc_status
            ? <button className="btn btn-lg btn-info" disabled>{'Verified User'}</button>
            : <button className="btn btn-lg btn-success" onClick={() => updateKycStatus(true)}>{loading ? 'Updating...' :'Set As Verified'}</button>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

const TableRow = ({values, handleModalData, handleShowState, serial}) => {
  let {id, email, fullname, country, phone, date_added, valid_id, passport, kyc_status} = values;

  const openModalWithData = () => {
    handleShowState(true)
    handleModalData(values)
  }

  const KycUploadStatus = () => {
    if (kyc_status) {
      return <div className="btn btn-outline-secondary" onClick={openModalWithData}> Verified </div>
    } else if(valid_id || passport) {
      return <div className="btn btn-outline-success" onClick={openModalWithData}> View </div>
    } else {
      return <div className="btn btn-outline-warning" onClick={openModalWithData}> Pending </div>
    }
  }

  return (
    <tr>
      <td>{serial}</td>
      <td>{email}</td>
      <td>{fullname}</td>
      <td>{country}</td>
      <td>{phone}</td>
      <td>{date_added}</td>
      <td>
        {
          <KycUploadStatus />
        }
      </td>
    </tr>
  )
}

const Dashboard = () => {
  const [errMsg, setErrMsg] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    console.log('Mounted');
    document.title = 'Admin Dashboard - Navafxtrade';

    fetch('/.netlify/functions/getUsers')
      .then(response => response.json())
      .then(data => {
        let _data = data.body?.rows;
        //console.log(JSON.stringify(_data, null, 2));
        setUsersData(_data);
      })
      .catch(error => setErrMsg(error.message))
    
  }, [])

  const UsersList = () => {
    if(usersData === []){
      console.log('Userdata is empty');
      return null;
    }
    let serialNo = 0
    let tableRows = usersData.map(({id, email, fullname, country, phone, date_added, valid_id, passport, kyc_status}, idx) => {
      serialNo += 1
      return <TableRow values={{id, email, fullname, country, phone, date_added, valid_id, passport, kyc_status}} handleModalData={setModalData} handleShowState={setShow} serial={serialNo} key={idx} />
    })
    return tableRows;
  }
  
  return (
      <div>
        <HelmetConfig title="Dashboard" description="" keywords={[]} />
        <KycModal open={show} handleShowState={setShow} userData={modalData} />

        <div className="row">
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Revenue</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$32123</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">+3.5%</p>
                    </div>
                    <h6 className="text-muted font-weight-normal">11.38% Since last month</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-codepen text-primary ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Sales</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$45850</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">+8.3%</p>
                    </div>
                    <h6 className="text-muted font-weight-normal"> 9.61% Since last month</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-wallet-travel text-danger ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Purchase</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$2039</h2>
                      <p className="text-danger ml-2 mb-0 font-weight-medium">-2.1% </p>
                    </div>
                    <h6 className="text-muted font-weight-normal">2.27% Since last month</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Users database</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> ID </th>
                        <th> Email </th>
                        <th> Fullname </th>
                        <th> Country </th>
                        <th> Phone </th>
                        <th> Register date </th>
                        <th> KYC upload </th>
                      </tr>
                    </thead>
                    <tbody>
                      { <UsersList /> ?? "Users data not available" }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div> 
  );
  
}

export default Dashboard;