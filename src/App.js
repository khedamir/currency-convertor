import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');

  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  const ratesRef = useRef({})

  useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = {...json.Valute, 'RUB': {Nominal: 1, Value: 1}};
        onChangeToPrice(1)
      })
      .catch((err) => {
        console.warn(err);
        alert("Сбой при получении данных")
      })
  }, [])

  const onChangeFromPrice = (value) => {
    const price = (ratesRef.current[fromCurrency].Value / ratesRef.current[fromCurrency].Nominal) * value
    const result = price / (ratesRef.current[toCurrency].Value / ratesRef.current[toCurrency].Nominal)

    setFromPrice(value);
    setToPrice(result.toFixed(3))
  }

  const onChangeToPrice = (value) => {
    const price = value * (ratesRef.current[toCurrency].Value / ratesRef.current[toCurrency].Nominal)
    const result = price / (ratesRef.current[fromCurrency].Value / ratesRef.current[fromCurrency].Nominal)

    setToPrice(value)
    setFromPrice(result.toFixed(3))
  }

  useEffect(() => {
    if(Object.keys(ratesRef.current).length) {
      onChangeFromPrice(fromPrice)
    }
  }, [fromCurrency])

  useEffect(() => {
    if(Object.keys(ratesRef.current).length) {
      onChangeFromPrice(fromPrice)
    }
  }, [toCurrency])

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangeFromPrice}
      />
      <Block 
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={setToCurrency} 
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
