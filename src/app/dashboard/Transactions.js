import React from 'react'
import HelmetConfig from '../shared/Helmet';

const Transactions = () => {
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
                <h4 className="card-title">Withdrawal History</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                    {/* email, txn_id, amount, type, payment_mode, confirmation_status, date_added */}
                      <tr>
                        <th> S/N </th>
                        <th> Email </th>
                        <th> Txn Id </th>
                        <th> Amount </th>
                        <th> Type </th>
                        <th> Payment Mode </th>
                        <th> Date </th>
                        <th> Payment Status </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={8} className='text-center'>No Transactions yet</td>
                      </tr>
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