import React, {useEffect, useState} from 'react';
import { Form } from 'react-bootstrap';

const Deposit = () => {
    const BankDetails = '0987654321';
    const BtcAddress = '0xbtcjkjf82499j9Jjf9455678FFGTY557dgf76RF7';
    const EthAddress = '0xethsjkjfjhdjksfjBkGH68BH8FFGTY557dgf76RF7';

    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState();
    const [mode, setMode] = useState('');

    useEffect(() => {
        if (mode == '') return;
        
        let acctDetails = {
            bank: BankDetails,
            bitcoin: BtcAddress,
            ethereum: EthAddress
        }
        switch (mode) {
            case 'bank':
                setAddress(acctDetails.bank)
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


    return (
    <div className="container">
        <div className="row">
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Bank</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$32123</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">+3.5%</p>
                    </div>
                    <h6 className="text-muted font-weight-normal">Min: 50$</h6>
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
                <h5>Bitcoin</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$45850</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">+8.3%</p>
                    </div>
                    <h6 className="text-muted font-weight-normal"> Min: 0.000001 Btc</h6>
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
                <h5>Ethereum</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">$2039</h2>
                      <p className="text-danger ml-2 mb-0 font-weight-medium">-2.1% </p>
                    </div>
                    <h6 className="text-muted font-weight-normal">Min: 0.00001 Eth</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
            <div className="col-xs-12 grid-margin">
                <form className='form-sample' encType='multipart/form-data'>
                    <div className="card">
                        <div className="card-body">
                        <h2 className='text-center'>Deposit Funds</h2>
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
                                <input type="text" name="" value={address} id="address" className="form-control" disabled required/>
                            </Form.Group>
                        </div>
                        <div className="col-md-6 grid-margin">
                            <Form.Group className='mb-3'>
                                <label>Proof of Payment</label>
                                <div className="custom-file mt-1">
                                    <Form.Control type="file" className="form-control" id="customFileLang" lang="es" hidden />
                                    <div className="container w-100 border border-sm rounded">
                                        <div className="d-flex flex-column justify-content-center align-items-center" style={{minHeight: 170}}>
                                            <h3 className="text-secondary">Drag and drop file</h3>
                                            <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                                        </div>
                                    </div>
                                </div>
                            </Form.Group>
                        </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="container text-center">
                                <input type="submit" value="Submit" className="btn btn-success btn-lg" />
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