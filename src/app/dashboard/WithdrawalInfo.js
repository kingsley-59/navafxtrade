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

const AddressRow = ({values, handleModalData, handleShowState, serial}) => {
  let {id, email, account_name, account_no, bank, btc_address, eth_address, date_added} = values;

  const openModalWithData = () => {
    handleShowState(true)
    handleModalData(values)
  }

  return (
    <tr>
      <td>{serial}</td>
      <td>
        <span>{email}</span><br/>
        <span>{bank}</span>
      </td>
      <td>{btc_address}</td>
      <td>{eth_address}</td>
      <td>
        <span>{account_name}</span><br/>
        <span>{account_no}</span>
      </td>
      <td>{date_added}</td>
    </tr>
  )
}

const Dashboard = () => {
  const [errMsg, setErrMsg] = useState('');
  const [addresses, setAddresses] = useState([]);

  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    console.log('Mounted');
    document.title = 'Admin Dashboard - Navafxtrade';
    
    fetch('/.netlify/functions/getWithdrawalInfo')
      .then(response => response.json())
      .then(data => {
        let _data = data.body?.rows;
        //console.log(JSON.stringify(_data, null, 2));
        setAddresses(_data);
      })
      .catch(error => setErrMsg(error.message))
  }, [])

  const AddressList = () => {
    if(addresses === []){
      console.log('Address list is empty');
      return null;
    }
    let serialNo = 0
    let tableRows = addresses.map(({id, email, account_name, account_no, bank, btc_address, eth_address, date_added}, idx) => {
      serialNo += 1
      return <AddressRow values={{id, email, account_name, account_no, bank, btc_address, eth_address, date_added}} handleModalData={setModalData} handleShowState={setShow} serial={serialNo} key={idx} />
    })
    return tableRows;
  }
  
  return (
      <div>
        <HelmetConfig title="Dashboard" description="" keywords={[]} />
        <KycModal open={show} handleShowState={setShow} userData={modalData} />
        <div className="page-header">
          <h3 className="page-title"> Withdrawal Information </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Tables</a></li>
              <li className="breadcrumb-item active" aria-current="page">Withdrawal info</li>
            </ol>
          </nav>
        </div>
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                {errMsg && <Alert variant='warning'>{errMsg}</Alert> }
                <h4 className="card-title fw-bolder">Withdrawal Info</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> SN </th>
                        <th> Email/Bank </th>
                        <th> Btc Address </th>
                        <th> Eth Address </th>
                        <th> Acct. name/number </th>
                        <th> Date added</th>
                      </tr>
                    </thead>
                    <tbody>
                      { <AddressList /> ?? "WIthdrawal info not available" }
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