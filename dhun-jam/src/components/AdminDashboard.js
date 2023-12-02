import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

let chart = null;

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState([0, 0, 0, 0]);
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const navigate = useNavigate();
  const chartRef = React.createRef();

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  useEffect(() => {
    updateChart();
  }, [data, customAmount, regularAmounts]);

  const id = parseInt(localStorage.getItem("id"));
  const token = localStorage.getItem("token");

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(`https://stg.dhunjam.in/account/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      setData(result.data);
      setCustomAmount(result.data.amount.category_6);
      setRegularAmounts([
        result.data.amount.category_7,
        result.data.amount.category_8,
        result.data.amount.category_9,
        result.data.amount.category_10,
      ]);
      setChargeCustomers(result.data.charge_customers);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const handleCustomAmountChange = (e) => {
    const amount = parseInt(e.target.value, 10);
    setCustomAmount(amount);
    setIsSaveButtonEnabled(true);
  };

  const handleRegularAmountChange = (index, e) => {
    const amount = parseInt(e.target.value, 10);
    const updatedRegularAmounts = [...regularAmounts];
    updatedRegularAmounts[index] = amount;
    setRegularAmounts(updatedRegularAmounts);
    setIsSaveButtonEnabled(true);
  };

  const handleChargeCustomersChange = () => {
    setChargeCustomers(!chargeCustomers);
    setIsSaveButtonEnabled(true);
  };

  const handleSave = async () => {
    try {
      await fetch(`https://stg.dhunjam.in/account/admin/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: {
            category_6: customAmount,
            category_7: regularAmounts[0],
            category_8: regularAmounts[1],
            category_9: regularAmounts[2],
            category_10: regularAmounts[3],
          },
          charge_customers: chargeCustomers,
        }),
      });

      await fetchAdminDetails();

      setIsSaveButtonEnabled(false);
    } catch (error) {
      console.error('Error updating admin prices:', error);
    }
  };

  const updateChart = () => {
    const ctx = chartRef.current?.getContext('2d');

    if (ctx) {
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Custom Amount', 'Category 7', 'Category 8', 'Category 9', 'Category 10'],
          datasets: [
            {
              label: 'Amounts',
              data: [customAmount, ...regularAmounts],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  return (
    <div className="container">
      {data && (
        <>
          <p>{data.name}, {data.location} on Dhun Jam</p>
          <div>
            <label>
              Do you want to charge your customers for requesting songs?
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    value="yes"
                    checked={chargeCustomers}
                    onChange={() => handleChargeCustomersChange(true)}
                    className="radio-input"
                  />
                  Yes
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    value="no"
                    checked={!chargeCustomers}
                    onChange={() => handleChargeCustomersChange(false)}
                    className="radio-input"
                  />
                  No
                </label>
              </div>
            </label>
          </div>
  
          {chargeCustomers && (
            <>
              <div>
                <label>
                  Custom song request amount:
                  <input
                    type="number"
                    value={customAmount}
                    min="99"
                    onChange={handleCustomAmountChange}
                    className="input-number"
                  />
                </label>
              </div>
  
              <div>
                <label>
                  Regular song request amounts:
                  {regularAmounts.map((amount, index) => (
                    <input
                      key={index}
                      type="number"
                      value={amount}
                      min="1"
                      onChange={(e) => handleRegularAmountChange(index, e)}
                      className="input-number"
                      style={{
                        border: '1px solid #ffffff',
                        padding: '10px',
                        margin: '5px 5px',
                        borderRadius: '10px',
                        width: '10%',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </label>
              </div>
            </>
          )}
  
          <canvas ref={chartRef} width="400" height="200" className="chart-canvas"></canvas>
  
          <button onClick={handleSave} disabled={!isSaveButtonEnabled} className="save-button">
            Save
          </button>
        </>
      )}
    </div>
  );  
};


export default AdminDashboard;