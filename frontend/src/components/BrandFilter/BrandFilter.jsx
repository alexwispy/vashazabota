import React, { useState } from 'react';
import './BrandFilter.css';

const BrandFilter = ({ brands, selectedBrands, setSelectedBrands }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  return (
    <div className="brand-filter">
      <div
        className="brand-filter__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Бренды</span>
        <span className="brand-filter__icon">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="brand-filter__cards">
          {brands.map((brand) => (
            <label key={brand} className="brand-filter__item">
              <input
                type="checkbox"
                className="brand-filter__checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleCheckboxChange(brand)}
              />
              <span className="brand-filter__name">{brand}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
