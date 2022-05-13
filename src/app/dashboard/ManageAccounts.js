import { Alert } from 'react-bootstrap';
import React, {useState, useEffect} from 'react'
import {Button, Modal} from 'react-bootstrap'
import HelmetConfig from '../shared/Helmet';

const DetailsModal = ({values, handleState, open}) => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [email, setEmail] = useState(values?.email);
  const [activePackage, setActivePackage] = useState(values?.active_package);
  const [deposits, setDeposit] = useState(values?.total_deposit);
  const [balance, setBalance] = useState(values?.balance);
  const [profit, setProfit] = useState(values?.profit);
  const [withdrawals, setWithdraw3als] = useState(values?.withdrawals);

  const handleClose = () => handleState(false);
  
  function updateAccountInfo() {
    let url = '/.netlify/functions/updateUsers';
    let body = {
      email, deposits, balance, profit, withdrawals, activePackage
    }
    let settings = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  
    fetch(url, settings)
    .then(response => response.json())
    .then(data => {
      if (data.status  === 'success') {
        console.log(data);
        setSuccessMsg('Info updated successfully!')
        values.deposits = deposits
        values.balance = balance
        values.profit = profit
        values.withdrawals = withdrawals
        setTimeout(() => {
          setSuccessMsg('')
        }, 5000)
      } else {
        setErrMsg('Error updating info')
        console.log(data.error)
      }
    })
    .catch(error => {
      console.log(error.message)
      setErrMsg('Could not update account info.')
    })
  }
  
  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Txn: {values?.txn_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { successMsg && <Alert variant='success'>{successMsg}</Alert>}
          { errMsg && <Alert variant='error'>{errMsg}</Alert>}
          <h3>Details:</h3>
          <dl className="row">
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9"> {values?.email} </dd>
            {/* <dt className="col-sm-3">Full name</dt>
            <dd className="col-sm-9"> {values?.fullname} </dd> */}
            <dt className="col-sm-3">Date</dt>
            <dd className="col-sm-9"> {values?.date_added} </dd>
            <dt className="col-sm-3">Active package</dt>
            <dd className="col-sm-9"> <input type="text" value={activePackage ?? 'No active package'} onChange={e => setActivePackage(e.target.value)} className="form-control" /> </dd>
            <dt className="col-sm-3">Deposit</dt>
            <dd className="col-sm-9"> <input type="number" value={deposits ?? '0'} onChange={e => setDeposit(e.target.value)} className="form-control" /> </dd>
            <dt className="col-sm-3">Balance</dt>
            <dd className="col-sm-9"> <input type="number" value={balance ?? '0'} onChange={e => setBalance(e.target.value)} className="form-control" /> </dd>
            <dt className="col-sm-3">Profit</dt>
            <dd className="col-sm-9"> <input type="number" value={profit ?? '0'} onChange={e => setProfit(e.target.value)} className="form-control" /> </dd>
            <dt className="col-sm-3">Withdrawals</dt>
            <dd className="col-sm-9"> <input type="number" value={withdrawals ?? '0'} onChange={e => setWithdraw3als(e.target.value)} className="form-control" /> </dd>
          </dl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {updateAccountInfo()}}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const TableRow = ({values, idx}) => {
  let {email, fullname, country, phone, referrals, total_deposit, balance, profit, withdrawals, date_added, active_package} = values;
  const [show, setShow] = useState(false)

  const handleShow = () => setShow(true);

  return (
    <>
    <tr onClick={handleShow}>
      <td>{idx}</td>
      {/* <td>
        <span>{email}</span><br/><span>{fullname}</span>
      </td> */}
      <td>
        <span>{email}</span><br/><span>{active_package ?? "No package"}</span>
      </td>
      <td>
        <span>{phone}</span><br/><span>{country}</span>
      </td>
      <td>${total_deposit ?? '0'}</td>
      <td>${balance ?? '0'}</td>
      <td>${profit ?? '0'}</td>
      <td>${withdrawals ?? '0'}</td>
    </tr>
    <DetailsModal values={values} handleState={setShow} open={show} />
    </>
  )
}

const ManageAccounts = () => {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState('all');
  const [usersData, setUsersData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    console.log('Mounted');
    document.title = 'Manage User Info - Navafxtrade';
    
    fetch('/.netlify/functions/getUsers')
      .then(response => response.json())
      .then(data => {
        let _data = data.body?.rows;
        //console.log(JSON.stringify(_data, null, 2));
        setUsersData(_data);
        setDisplayData(_data);
      })
      .catch(error => setErrMsg(error.message))
  }, [])

//   useEffect(() => {
//     let newTxnData;
//     switch (filter) {
//       case 'all':
//         setDisplayData(txnData);
//         break;
//       case 'deposits':
//         newTxnData = txnData.filter( txn => txn.type === 'deposit');
//         setDisplayData(newTxnData);
//         break;
//       case 'withdrawals':
//         newTxnData = txnData.filter( txn => txn.type === 'withdrawal');
//         setDisplayData(newTxnData);
//         break;
//       case 'active':
//         newTxnData = txnData.filter( txn => txn.confirmation_status === true);
//         setDisplayData(newTxnData);
//         break;
//       case 'pending':
//         newTxnData = txnData.filter( txn => txn.confirmation_status === false);
//         setDisplayData(newTxnData);
//         break;
    
//       default:
//         break;
//     }
//   }, [filter])

  const RowList = () => {
    if(displayData === []){
      console.log('Transactions data is empty');
      return null;
    }
    
    let tableRows = displayData?.map(({id, email, fullname, country, phone, referrals, total_deposit, balance, profit, withdrawals, date_added, active_package}, idx) => {
      return <TableRow values={{ email, fullname, country, phone, referrals, total_deposit, balance, profit, withdrawals, date_added, active_package}} key={idx} />
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
              <li className="breadcrumb-item active" aria-current="page">Manage accounts</li>
            </ol>
          </nav>
        </div>
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center mb-3 justify-content-between">
                  <div className="col-md-4 col-sm-6">
                    <h4 className="card-title fw-bolder">Manage User Accounts</h4>
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
                        <th> Email/Full name </th>
                        <th> Phone/Country </th>
                        <th> Deposit </th>
                        <th> balance </th>
                        <th> Profit </th>
                        <th> Withdrawals </th>
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

export default ManageAccounts