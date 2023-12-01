import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

let chart = null;

const AdminDashboard = ({ token }) => {
  const [data, setData] = useState(null);
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState([0, 0, 0, 0]);
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const navigate = useNavigate();
  const chartRef = React.createRef();

  useEffect(() => {
    if (token) {
      fetchAdminDetails();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    updateChart();
  }, [data, customAmount, regularAmounts]);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(`https://stg.dhunjam.in/account/admin/${token}`, {
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
    const ctx = chartRef.current.getContext('2d');
    
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
  };

  return (
    <div>
      {data && (
        <>
          <h1>{data.name}</h1>
          <h2>{data.location}</h2>

          <div>
            <label>
              Do you want to charge your customers for requesting songs?
              <input
                type="checkbox"
                checked={chargeCustomers}
                onChange={handleChargeCustomersChange}
              />
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
                  />
                </label>
              </div>

              <div>
                <label>
                  Regular song request amounts:
                  <input
                    type="number"
                    value={regularAmounts[0]}
                    min="79"
                    onChange={(e) => handleRegularAmountChange(0, e)}
                  />
                  <input
                    type="number"
                    value={regularAmounts[1]}
                    min="59"
                    onChange={(e) => handleRegularAmountChange(1, e)}
                  />
                  <input
                    type="number"
                    value={regularAmounts[2]}
                    min="39"
                    onChange={(e) => handleRegularAmountChange(2, e)}
                  />
                  <input
                    type="number"
                    value={regularAmounts[3]}
                    min="19"
                    onChange={(e) => handleRegularAmountChange(3, e)}
                  />
                </label>
              </div>

              <button onClick={handleSave} disabled={!isSaveButtonEnabled}>
                Save
              </button>
            </>
          )}

          {/* Render the canvas element for the chart */}
          <canvas ref={chartRef} width="400" height="200"></canvas>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
