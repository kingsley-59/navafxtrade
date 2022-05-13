import React, {useEffect, useState} from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { storage } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Deposit = () => {
    const BankDetails = '';
    const BtcAddress = 'bc1q4ytke5pq64w9mh7s4h25yw29ff0l7k8czhf2lj';
    const EthAddress = '0x16704171347b9fB39862689856E401aad69D5bE1';
    const TxnId = Date.now();

    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('');
    const [image, setImage] = useState();
    const [downloadUrl, setDownloadUrl] = useState('')


    const [warningMsg, setWarningMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitBtnText, setSubmitBtnText] = useState('Submit');
    const [copyBtnText, setCopyBtnText] = useState('Copy');

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
                setAddress(acctDetails.bank)
                setLoading(true);
                break;
            case 'bitcoin':
                setAddress(acctDetails.bitcoin)
                break;
            case 'ethereum':
                setAddress(acctDetails.ethereum)
                break;
            default:
                setAddress('');
                break;
        }
        return;
    }, [mode])

    const copyText = () => {
      navigator.clipboard.writeText(address);
      setCopyBtnText('Copied!')
      setTimeout(() => {
        setCopyBtnText('Copy')
      }, 6000);
    }

    const handleEmailVerification = () => {
      verifyEmail(currentUser)
        .then(() => setWarningMsg('Verification email sent! Please check your email.'))
    }

    const uploadImage = () => {
      try {
        const storageRef = ref(storage, `images/${TxnId + image.name }`);
        // upload proof of payment file
        uploadBytes(storageRef, image)
        .then((snapshot) => {
          setSuccessMsg("File upload successful");
          setDownloadUrl(TxnId + image.name);
          getDownloadURL(storageRef).then(url => {
            console.log(url)
            sendDepositRequest(url);
            return;
          })

        })
        .catch((error) => {
          setErrMsg(error.message)
          return;
        })
        
      } catch (error) {
        console.log(error.message)
        //setErrMsg(error.message);
      }

      return;
    }

    const sendDepositRequest = (imageUrl) => {
      setSubmitBtnText('sending deposit...')

      const payload = {
        email: currentUser.email,
        txnId: TxnId,
        amount: amount,
        type: 'deposit',
        paymentMode: mode,
        proof: imageUrl ?? downloadUrl
      }

      console.log(payload);

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
      setSubmitBtnText('processing...')

      if (!emailVerified) {
        setSubmitBtnText('Cancelled')
        return;
      }
      
      if (!image) {
        sendDepositRequest();
        return;
      }

      uploadImage();
      
    }


    return (
    <div className="container">
        {warningMsg && <Alert className='d-flex justify-content-between' variant={'warning'}>{warningMsg} <button className='btn btn-warning' onClick={handleEmailVerification} >Verify Email</button></Alert>}

        <div className="row">
            <div className="col-xs-12 grid-margin">
                <form className='form-sample' onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="card">
                        <div className="card-body">
                        <h2 className='text-center'>Deposit Funds</h2>
                        {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
                        {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
                        <div className="info-msg mb-3">
                          { amount && `You are to make payment of $${amount} using your preferred mode of payment below. Screenshot the proof of payment`}
                        </div>
                        <div className="row">
                        <div className="col-md-6 grid-margin">
                            <Form.Group className='mb-3'>
                                <label htmlFor="amount">Amount</label>
                                <input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" className="form-control" placeholder='amount (USD)' required/>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <label htmlFor="package">Package</label>
                                <select name="package" className='form-control' onChange={(e) => setMode(e.target.value)} id="" required>
                                    <option>select payment mode</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="bitcoin">Bitcoin</option>
                                    <option value="ethereum">Ethereum</option>
                                </select>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <label htmlFor="address">Account No./Address</label>
                                <div className='input-group'>
                                  <input type="text" name="" value={address} id="address" className="form-control" disabled />
                                  {/* <button class="btn btn-outline-secondary text-success" onClick={copyText} >{ copyBtnText }</button> */}
                                  <input className="btn btn-outline-secondary text-success" onClick={copyText} type="button" value={ copyBtnText } />
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-md-6 grid-margin">
                            <Form.Group className='mb-3'>
                                <label>Proof of Payment</label>
                                <div className="custom-file mt-1">
                                    <Form.Control type="file" onChange={(e) => {setImage(e.target.files[0])}} className="form-control" id="customFileLang" lang="es" hidden />
                                    <div className="container w-100 border border-sm rounded">
                                        <div className="d-flex flex-column justify-content-center align-items-center" style={{minHeight: 170}}>
                                            <h3 className="text-secondary"> { image?.name ?? 'Upload proof of payment' } </h3>
                                            <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                                        </div>
                                    </div>
                                </div>
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


//   uploadTask.on("state_changed",
      //   (snapshot) => {
      //     const progress =
      //       Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //     setProgresspercent(progress);
      //   },
      //   (error) => {
      //     setErrMsg(error);
      //   },
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //       setImgUrl(downloadURL)
      //       console.log(imgUrl)
            
      //     });
      //   }
      //  );