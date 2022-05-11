import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';

const DetailsModal = ({values, handleState, open}) => {

  const displayData = values ?? {};

  const handleClose = () => handleState(false);
  
  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Txn: {displayData?.txn_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Details:</h3>
          <dl className="row">
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9"> {displayData?.email} </dd>
            <dt className="col-sm-3">Amount</dt>
            <dd className="col-sm-9"> {displayData?.amount} </dd>
            <dt className="col-sm-3">Type</dt>
            <dd className="col-sm-9"> {displayData?.type} </dd>
            <dt className="col-sm-3">Payment mode</dt>
            <dd className="col-sm-9"> {displayData?.payment_mode} </dd>
            <dt className="col-sm-3">Confirmation</dt>
            <dd className="col-sm-9"> {displayData?.confirmation_status ? 'Active' : 'Pending'} </dd>
            <dt className="col-sm-3">Date</dt>
            <dd className="col-sm-9"> {displayData?.date_added} </dd>
            <dt className="col-sm-3">Proof</dt>
            <dd className="col-sm-9"> {displayData?.proof_of_payment} </dd>
          </dl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const TableRow = ({values, idx}) => {
  let {email, txn_id, amount, type, payment_mode, confirmation_status, date_added, proof_of_payment} = values;
  const [show, setShow] = useState(false)

  const handleShow = () => setShow(true);

  return (
    <>
    <tr onClick={handleShow}>
      <td>{idx}</td>
      <td>
        <span>{email}</span><br/><span>{txn_id}</span>
      </td>
      <td>
        <span>{amount}</span><br/><span>{type}</span>
      </td>
      <td>{payment_mode}</td>
      <td>{date_added}</td>
      <td>
        {confirmation_status
          ? <div className="badge badge-outline-success"> Active </div>
          : <div className="badge badge-outline-warning"> Pending </div>
        }
      </td>
      <td>
        {proof_of_payment
          ? <a className='btn btn-outline-success' href={proof_of_payment} target="_blank" rel="noopener noreferrer">View File</a> 
          : <span className='btn btn-outline-secondary'>No proof</span> 
        } 
      </td>
    </tr>
    <DetailsModal values={values} handleState={setShow} open={show} />
    </>
  )
}

const Transactions = () => {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState('all');
  const [txnData, setTxnData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const {cuurentUser} = useAuth()

  useEffect(() => {
    console.log('Mounted');
    document.title = 'Transactions - Navafxtrade';
    const email = cuurentUser?.email;
    
    fetch(`/.netlify/functions/Transactions?userEmail=${email}`)
      .then(response => response.json())
      .then(data => {
        let _data = data.body?.rows;
        //console.log(JSON.stringify(_data, null, 2));
        setTxnData(_data);
        setDisplayData(_data);
      })
      .catch(error => setErrMsg(error.message))
  }, [])

  useEffect(() => {
    let newTxnData;
    switch (filter) {
      case 'all':
        setDisplayData(txnData);
        break;
      case 'deposits':
        newTxnData = txnData.filter( txn => txn.type === 'deposit');
        setDisplayData(newTxnData);
        break;
      case 'withdrawals':
        newTxnData = txnData.filter( txn => txn.type === 'withdrawal');
        setDisplayData(newTxnData);
        break;
      case 'active':
        newTxnData = txnData.filter( txn => txn.confirmation_status === true);
        setDisplayData(newTxnData);
        break;
      case 'pending':
        newTxnData = txnData.filter( txn => txn.confirmation_status === false);
        setDisplayData(newTxnData);
        break;
    
      default:
        break;
    }
  }, [filter])

  const RowList = () => {
    if(displayData === []){
      console.log('Transactions data is empty');
      return null;
    }
    
    let tableRows = displayData?.map(({id, email, txn_id, amount, type, payment_mode, confirmation_status, date_added, proof_of_payment}, idx) => {
      return <TableRow values={{ email, txn_id, amount, type, payment_mode, confirmation_status, date_added, proof_of_payment}} key={idx} />
    })
    return tableRows ?? null;
  }

  return (
    <div>
      <HelmetConfig title="Transaction history" description="" keywords={[]} />
        <div className="page-header">
          <h3 className="page-title"> Transactions </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Tables</a></li>
              <li className="breadcrumb-item active" aria-current="page">Transactions</li>
            </ol>
          </nav>
        </div>
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center mb-3 justify-content-between">
                  <div className="col-md-4 col-sm-6">
                    <h4 className="card-title fw-bolder">Transaction History</h4>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="row align-items-center">
                      <div className="col-auto">Filter by:</div>
                      <div className="col-auto">
                        <select onChange={e => setFilter(e.target.value)} className="form-select">
                          <option value="all">Show all</option>
                          <option value="deposits">Deposits only</option>
                          <option value="withdrawals">Withdrawals only</option>
                          <option value="active">Active only</option>
                          <option value="pending">Pending only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                    {/* email, txn_id, amount, type, payment_mode, confirmation_status, date_added */}
                      <tr>
                        <th> S/N </th>
                        <th> Email/Txn Id </th>
                        <th> Amount/Type </th>
                        <th> Payment Mode </th>
                        <th> Date </th>
                        <th> Payment Status </th>
                        <th> Proof of Payment </th>
                      </tr>
                    </thead>
                    <tbody>
                      { <RowList /> ?? "Users data not available" }
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

export default Transactions