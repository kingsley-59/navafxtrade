
import React, { useState, useEffect } from 'react'
import { Alert, Modal } from 'react-bootstrap';
import HelmetConfig from '../shared/Helmet';

const KycModal = ({open, handleShowState, message}) => {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => handleShowState(false);

  const updateMessageStatus = (status) => {
    setErrMsg('');
    setSuccessMsg('');
    setLoading(true)

    const payload = {
      message_id: message?.id,
      replied: status
    }
    const settings = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    fetch('/.netlify/functions/updateMessage', settings)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setSuccessMsg('Message status updated successfully');
        message.replied = true;
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
        { successMsg && <Alert variant='success' >{successMsg}</Alert> }
        { errMsg && <Alert variant='warning' >{errMsg}</Alert> }
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>User Message</div>
        </div>
      </Modal.Header>
      <Modal.Body className='card'>
        <h3>Details:</h3>
          <dl className="row">
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9"> {message?.email} </dd>
            <dt className="col-sm-3">Subject</dt>
            <dd className="col-sm-9"> {message?.subject} </dd>
            <dt className="col-sm-3">Message</dt>
            <dd className="col-sm-9"> {message?.message} </dd>
            <dt className="col-sm-3">Date</dt>
            <dd className="col-sm-9"> {message?.date_added} </dd>
          </dl>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleClose}>Close</button>
        <button className='btn btn-info' onClick={() => updateMessageStatus(true)}>{message?.replied ? 'Replied' : 'Mark as replied'}</button>
      </Modal.Footer>
    </Modal>
  );
}

const TableRow = ({values, handleModalData, handleShowState, serial}) => {
  let {id, email, subject, message, date_added, replied} = values;

  const openModalWithData = () => {
    handleShowState(true)
    handleModalData(values)
  }

  return (
    <tr onClick={openModalWithData} >
      <td>{serial} {!replied && <span className="menu-icon"><i className="mdi mdi-message-text text-info"></i></span>}</td>
      <td>{email}</td>
      <td>{subject}</td>
      <td>{message.substring(0, 45)}...</td>
      <td>{date_added}</td>
    </tr>
  )
}

const ContactSupport = () => {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [messages, setMessages] = useState([]);

  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    console.log('Mounted');
    document.title = 'Admin Dashboard - Navafxtrade';

    fetch('/.netlify/functions/getMessages')
      .then(response => response.json())
      .then(data => {
        let _data = data.body?.rows ?? [] ;
        //console.log(JSON.stringify(_data, null, 2));
        setMessages(_data);
      })
      .catch(error => setErrMsg(error.message))
    
  }, [])

  const RowList = () => {
    if(messages === []){
      console.log('There are no messages');
      return null;
    }
    let serialNo = 0;
    let tableRows = messages.map(({id, email, subject, message, date_added, replied}, idx) => {
      serialNo += 1
      return <TableRow values={{id, email, subject, message, date_added, replied}} handleModalData={setModalData} handleShowState={setShow} serial={serialNo} key={idx} />
    })
    return tableRows;
  }

  return (
    <div>
        <HelmetConfig title="Messages" description="" keywords={[]} />
        <KycModal open={show} handleShowState={setShow} message={modalData} />
        { successMsg && <Alert variant='success' >{successMsg}</Alert> }
        { errMsg && <Alert variant='warning' >{errMsg}</Alert> }
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-center w-100'>
                  <h4 className="card-title">Users' Messages</h4>
                  <small>Unreplied messages are tagged with '<span className="menu-icon"><i className="mdi mdi-message-text text-info"></i></span>'</small>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> S/N </th>
                        <th> Email </th>
                        <th> Subject </th>
                        <th> Message </th>
                        <th> Date </th>
                      </tr>
                    </thead>
                    <tbody>
                      { <RowList /> ?? "No messages yet." }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
      </div> 
  )
}

export default ContactSupport