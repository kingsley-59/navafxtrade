import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const WithdrawalInfo = () => {
    const [email, setEmail] = useState('')
    const [acctName, setAcctName] = useState('');
    const [acctNo, setAcctNo] = useState();
    const [bankName, setBankName] = useState('');
    const [ethAddress, setEthAddress] = useState('');
    const [btcAddress, setBtcAddress] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Account Setings - Dashboard';
        let email, encodedEmail;
    
        email = currentUser?.email;
        setEmail(email);
        encodedEmail = encodeURIComponent(email);
        if (!email) {
          setErrMsg("Oops! Looks like user isn't logged in")
          navigate('/login');
          return false;
        }
        console.log(encodedEmail);
    
        fetch(`/.netlify/functions/WithdrawalInfo?userEmail=${encodedEmail}`)
          .then(response => response.json())
          .then((data) => {
            let _data = data?.body?.rows;
            setEmail(email);
            setAcctName(_data?.account_name ?? '');
            setAcctNo(_data?.account_no ?? '');
            setBankName(_data?.bank ?? '');
            setBtcAddress(_data?.btc_address ?? '');
            setEthAddress(_data?.eth_address ?? '');
            console.log(_data);
          })
          .catch((err) => {
            console.log(err.message);
            setErrMsg(err.message);
          });
      }, [])

    const submitDetails = async (e) => {
        e.preventDefault();
        setErrMsg('');
        let payload, settings;
        payload = {
            email, acctName, acctNo, bankName, ethAddress, btcAddress
        }
        console.log(payload)
        settings = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }

        try {
            fetch('/.netlify/functions/WithdrawalInfo', settings)
            .then(response => response.json())
            .then(data => {
                if (data?.status === 'success') {
                    setSuccessMsg('Account info updated successfully.')
                    setTimeout(() => {
                        setSuccessMsg('')
                    }, 7000)
                };
            })
            .catch(error => setErrMsg(error.message))
            
        } catch (error) {
            console.log(error);
            setErrMsg(error.message);
        }

    }


  return (
    <div className='container'>
        {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
        {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
        <div className="row">
            <div className="col-sm-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <form action="" onSubmit={submitDetails}>
                    <div className="h2">Bank Details</div>
                    <div className="form-group">
                        <label htmlFor="accountname">Account name</label>
                        <input type="text" value={acctName} onChange={(e) => {setAcctName(e.target.value)}} className="form-control" id="accountname" placeholder='account name must match with profile name' required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="accountno">Account number</label>
                        <input type="number" value={acctNo} onChange={(e) => {setAcctNo(e.target.value)}} id="accountno" className="form-control" placeholder='your account number' required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bankname">Bank name</label>
                        <input type="text" value={bankName} onChange={(e) => {setBankName(e.target.value)}} className="form-control" id="bankname" placeholder='enter your bank name' required/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-success btn-lg" />
                    </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-sm-6 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <form action="" onSubmit={submitDetails}>
                    <div className="h2">Bitcoin </div>
                    <div className="form-group">
                        <label htmlFor="btcwallet">Bitcoin wallet</label>
                        <input type="text" value={btcAddress} onChange={e => setBtcAddress(e.target.value)} className="form-control" id="btcwallet" placeholder='e.g. 0xbtcjkjf82499j9Jjf9455678FFGTY557dgf76RF7' required/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-success btn-lg" />
                    </div>
                    </form>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <form action="" onSubmit={submitDetails}>
                    <div className="h2">Ethereum </div>
                    <div className="form-group">
                        <label htmlFor="btcwallet">Ethereum wallet</label>
                        <input type="text" value={ethAddress} onChange={e => setEthAddress(e.target.value)} className="form-control" id="btcwallet" placeholder='e.g. 0xethjkjf82499j9Jjf9455678FFGTY557dgf76RF7' required/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-success btn-lg" />
                    </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default WithdrawalInfo