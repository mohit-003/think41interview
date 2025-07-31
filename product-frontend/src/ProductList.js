// src/ProductList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Product Catalog</h1>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Brand: {product.brand}</p>
                  <p className="card-text fw-bold text-primary">₹{product.retail_price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
