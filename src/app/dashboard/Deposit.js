import React, {useEffect, useState} from 'react';

const Deposit = () => {
    
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitBtnText, setSubmitBtnText] = useState('Submit')

    useEffect(() => {
      document.title = 'Deposit - Dashboard';
      //get all tgransactions with type deposit
    }, [])


    return (
    <div className="container">
      <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Deposit History</h4>
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