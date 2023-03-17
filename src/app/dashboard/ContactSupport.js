import React, {useState, useEffect} from 'react'
import { Form, Alert } from 'react-bootstrap';
import HelmetConfig from '../shared/Helmet';
import {useAuth} from '../context/AuthProvider'

const ContactSupport = () => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const {currentUser} = useAuth()

  useEffect(() => {
    setEmail(currentUser?.email)
  }, [])

  function reset(option = 'form') {
    switch (option) {
      case 'form':
        setSubject('')
        setMessage('')
        break;
      case 'alerts':
        setErrMsg('')
        setSuccessMsg('')
        break;
      default:
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    reset('alerts')
    setLoading(true)

    const payload = {
      email, subject, message
    }
    const settings = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    fetch('/.netlify/functions/SendMessage', settings)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setSuccessMsg('Message sent!')
        reset()
      } else {
        setErrMsg('Error occured. Please try again later.')
        console.log(data)
      }
      setLoading(false)
    })
  }

  return (
    <div>
      <HelmetConfig title="Contact Support" description="" keywords={[]} />
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{height: "100vh"}}>
            <div className="col-lg-6 col-md-6 col-sm-10 mx-auto">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center mb-3">Contact Support</h4>
                {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
                {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
                <form className="forms-sample" onSubmit={handleSubmit}>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="form-control" id="exampleInputEmail1" placeholder="Email" required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputUsername1">Subject</label>
                    <Form.Control type="text" value={subject} onChange={(e) => setSubject(e.target.value)} id="exampleInputUsername1" placeholder="Subject" required/>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                      <label htmlFor="exampleTextarea1">Message</label>
                      <textarea name="" value={message} onChange={(e) => setMessage(e.target.value)} className="form-control" id="exampleTextarea1" cols="30" rows="10" placeholder="write a message..." required></textarea>
                  </Form.Group>
                  
                  <Form.Group className='text-center p-3'>
                    <button type="submit" className="btn btn-primary m-auto" disabled={loading}>{loading ? 'sending...' : 'submit'}</button>
                  </Form.Group>
                </form>
              </div>
            </div>
            </div>
          </div>
        </div>  
    </div>
  )
}

export default ContactSupport