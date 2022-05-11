import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

// let schema = {
//     minimum, maximum, percentage, duration
// }

const DataList = [
    {num: 'ONE', min: 200, max: 500, percent: 50, duration: 1},
    {num: 'TWO',min: 500, max: 2000, percent: 100, duration: 3},
    {num: 'THREE',min: 2000, max: 5000, percent: 250, duration: 7},
    {num: 'FOUR',min: 5000, max: 10000, percent: 550, duration: 10},
    {num: 'FIVE',min: 10000, max: '000000', percent: 1250, duration: 15}
]

const PackageCard = ({num, min, max, percent, duration}) => {
    let navigate = useNavigate();
    let { currentUser } = useAuth();

    const email = currentUser?.email;

    const [amount, setAmount] = useState(min);

    return (
        <div className="col-xs-12 col-lg-6 col-xl-4 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <div className="wrapper border rounded p-3">
                            <h3 className='mb-3'>PLAN {num}</h3>
                            <div className="mb-3"><span className="h2 text-center">${min} - ${max}</span></div>
                            <table className="table mb-3">
                                <tbody>
                                    <tr>
                                        <td>Minimum Possible Deposit</td>
                                        <td>{}min</td>
                                    </tr>
                                    <tr>
                                        <td>Maximum Possible Deposit</td>
                                        <td>{max} </td>
                                    </tr>
                                    <tr>
                                        <td>Percentage Return</td>
                                        <td>{percent}% </td>
                                    </tr>
                                    <tr>
                                        <td>Duration</td>
                                        <td>{duration} Day</td>
                                    </tr>
                                </tbody>
                            </table>
                            <form onSubmit={(e) => {e.preventDefault(); UpdateActivePlan(email, amount, num)}}>
                                <div className="form-group">
                                    <label htmlFor="amount"></label>
                                    <input type="number" defaultValue={min} onChange={ e => setAmount(e.target.value)} className='form-control' id="" required/>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Join plan" className="btn btn-primary form-control" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}

function UpdateActivePlan(email, amount, plan) {    
    const settings = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, active_package: `Plan ${plan}: N${amount} [pending]`})
    }
    fetch('/.netlify/functions/SetActivePlan', settings)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Plan activatd successfully!");
            }
        })
        .catch(error => alert(error.message));
}

const Packages = () => {
    let packageCards = DataList.map(({num, min, max, percent, duration}, idx) => {
        return <PackageCard num={num} min={min} max={max} percent={percent} duration={duration} />
    });
  return (
    <div className='container'>
        <div className="row">
            { packageCards }
        </div>
    </div>
  )
}

export default Packages