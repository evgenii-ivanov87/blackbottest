// App.tsx
import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import './App.css'; // Подключаем файл стилей

interface ExchangeRate {
  price: number;
}

const App: React.FC = () => {
  const [ethAmount, setEthAmount] = useState<number>(0);
  const [action, setAction] = useState<string>('buy');
  const [usdtAmount, setUsdtAmount] = useState<number>(0);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get<ExchangeRate>(
          'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
        );
        const exchangeRate = response.data.price;
        const calculatedAmount = action === 'buy' ? ethAmount * exchangeRate : Number((ethAmount / exchangeRate).toFixed(5)) ;
        setUsdtAmount(calculatedAmount);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    if (ethAmount !== 0) {
      fetchExchangeRate();
    }
  }, [ethAmount, action]);

  const handleEthAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEthAmount(parseFloat(event.target.value));
  };

  const handleBuyClick = () => {
    setAction('buy');
  };

  const handleSellClick = () => {
    setAction('sell');
  };

  return (
    <div className="container">
      <h1 className="content">USDT/ETH Exchange</h1>
      <div className="content">
        <label className="label">
          Enter ETH amount:
          <input className="input" type="number" value={ethAmount} onChange={handleEthAmountChange} step="0.01" min="0"/>
        </label>
        <div>
          <button className="buyButton" onClick={handleBuyClick}>BUY</button>
          <button className="sellButton" onClick={handleSellClick}>SELL</button>
        </div>
        <div>
          <p>Amount of USDT required for: </p>
          <p>{`${action === 'buy' ? 'buying' : 'selling'}: ${usdtAmount}`}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
