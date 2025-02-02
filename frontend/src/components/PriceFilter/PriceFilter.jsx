import React, { useState } from 'react';
import './PriceFilter.css';

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
  const [open, setOpen] = useState(false);
  const [tempMin, setTempMin] = useState(minPrice);
  const [tempMax, setTempMax] = useState(maxPrice);

  const toggleOpen = () => setOpen(!open);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setTempMin(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setTempMax(value);
  };

  const handleBlur = () => {
    let min = Number(tempMin) || 0;
    let max = Number(tempMax) || 0;
    if (min > max) {
      min = max;
    }
    onPriceChange(min, max);
    setTempMin(min);
    setTempMax(max);
  };

  return (
    <div className="price-filter">
      <div className="price-item" onClick={toggleOpen}>
        <h4>Цена</h4>
        <span className="toggle-symbol">{open ? "▲" : "▼"}</span>
      </div>
      <div className={`price-inputs ${open ? 'open' : ''}`}>
        <input
          type="number"
          value={tempMin}
          onChange={handleMinPriceChange}
          onBlur={handleBlur}
          placeholder="Мин"
        />
        <input
          type="number"
          value={tempMax}
          onChange={handleMaxPriceChange}
          onBlur={handleBlur}
          placeholder="Макс"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
