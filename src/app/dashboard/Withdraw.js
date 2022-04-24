import React, {useEffect, useState} from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const Deposit = () => {
    const BankDetails = '0987654321';
    const BtcAddress = 'e.g, 0xbtcjkjf82499j9Jjf9455678FFGTY557dgf76RF7';
    const EthAddress = 'e.g, 0xethsjkjfjhdjksfjBkGH68BH8FFGTY557dgf76RF7';
    const TxnId = Date.now();

    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('');
    const [addressPlaceholder, setAddressPlaceholder] = useState('')

    const [warningMsg, setWarningMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitBtnText, setSubmitBtnText] = useState('Submit')

    const { currentUser, emailVerified, verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      document.title = 'Deposit - Dashboard';
      let email, encodedEmail;

      if (!emailVerified) setWarningMsg('Email not verified! Please verify your email before you make transactions.')

      email = currentUser?.email;
      encodedEmail = encodeURIComponent(email);
      if (!email) {
        navigate('/login');
        return false;
      }

      // make request for deposit history for this account
    }, [])

    useEffect(() => {
        if (mode == '') return;
        
        setErrMsg('')
        setSuccessMsg('')
        setLoading(false);
        setSubmitBtnText('Submit')
        let acctDetails = {
            bank: BankDetails,
            bitcoin: BtcAddress,
            ethereum: EthAddress
        }
        switch (mode) {
            case 'bank':
                //setAddress(acctDetails.bank)
                setErrMsg("Bank transfer is currently unsupported. Please try another option.");
                setLoading(true);
                break;
            case 'bitcoin':
                setAddressPlaceholder(acctDetails.bitcoin)
                break;
            case 'ethereum':
                setAddressPlaceholder(acctDetails.ethereum)
                break;
            default:
                setAddress('');
                break;
        }
        return;
    }, [mode])

    const handleEmailVerification = () => {
      verifyEmail(currentUser)
        .then(() => setWarningMsg('Verification email sent! Please check your email.'))
    }

    const sendDepositRequest = () => {
      setSubmitBtnText('sending deposit...')

      const payload = {
        email: currentUser.email,
        txnId: TxnId,
        amount: amount,
        type: 'deposit',
        paymentMode: mode,
        proof: null
      }

      const settings = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }

      fetch('/.netlify/functions/Transactions', settings)
        .then(response => response.json())
        .then((data) => {
          console.log(data);
          if (data.status == 'error') {
            setErrMsg(data.message);
            setSubmitBtnText('submit');
            setLoading(false);
            return;
          }
          setSubmitBtnText('Done.');
        })
        .catch(error => setErrMsg(error.message))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      setErrMsg('')
      setSuccessMsg('')
      setLoading(true);
      setSubmitBtnText('uploading image...')

      if (!emailVerified) {
        setSubmitBtnText('Cancelled')
        return;
      }
      
      sendDepositRequest();
      
    }


    return (
    <div className="container">
        {warningMsg && <Alert className='d-flex justify-content-between' variant={'warning'}>{warningMsg} <button className='btn btn-warning' onClick={handleEmailVerification} >Verify Email</button></Alert>}

        <div className="row">
            <div className="col-xs-12 grid-margin">
                <form className='form-sample' onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="card">
                        <div className="card-body">
                        <h2 className='text-center'>Withdraw Funds</h2>
                        {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
                        {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
                        <div className="row justify-content-center">
                        <div className="col-md-6 text-left grid-margin">
                            <Form.Group className='mb-3'>
                                <label htmlFor="amount" className='mb-2'>Amount</label>
                                <input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" className="form-control" placeholder='amount (USD)' required/>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <label htmlFor="package" className='mb-2'>Package</label>
                                <select name="package" className='form-control' onChange={(e) => setMode(e.target.value)} id="" required>
                                    <option>select payment mode</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="bitcoin">Bitcoin</option>
                                    <option value="ethereum">Ethereum</option>
                                </select>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <label htmlFor="address" className='mb-2'>Account No./Address</label>
                                <input type="text" name="" value={address} onChange={(e) => setAddress(e.target.value)} id="address" className="form-control" placeholder={addressPlaceholder} required/>
                            </Form.Group>
                        </div>
                        
                        </div>
                        <div className="row justify-content-center">
                            <div className="container text-center">
                                <input type="submit" value={submitBtnText} className="btn btn-success btn-lg" disabled={loading}/>
                            </div>
                        </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Deposit

