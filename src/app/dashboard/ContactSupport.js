
import React from 'react'
import { Form } from 'react-bootstrap';

const ContactSupport = () => {
  return (
    <div>
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{height: "100vh"}}>
            <div className="col-lg-6 col-md-6 col-sm-10 mx-auto">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center mb-3">Contact Support</h4>
                {/* <p className="card-description"> Basic form layout </p> */}
                <form className="forms-sample">
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <Form.Control type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputUsername1">Subject</label>
                    <Form.Control type="text" id="exampleInputUsername1" placeholder="Username" />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                      <label htmlFor="exampleTextarea1">Message</label>
                      <textarea name="" className="form-control" id="exampleTextarea1" cols="30" rows="10"></textarea>
                  </Form.Group>
                  
                  <Form.Group className='text-center p-3'>
                    <button type="submit" className="btn btn-primary m-auto">Submit</button>
                  </Form.Group>
                </form>
              </div>
              <p className="text-center">Don't have an account? <a href="/register">Register</a></p>
            </div>
            </div>
          </div>
        </div>  
    </div>
  )
}

export default ContactSupport