// src/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">{product.name}</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Brand:</strong> {product.brand}</li>
          <li className="list-group-item"><strong>Category:</strong> {product.category}</li>
          <li className="list-group-item"><strong>SKU:</strong> {product.sku}</li>
          <li className="list-group-item"><strong>Retail Price:</strong> ₹{product.retail_price}</li>
          <li className="list-group-item"><strong>Cost:</strong> ₹{product.cost}</li>
        </ul>
        <Link to="/" className="btn btn-outline-primary mt-4">← Back to Products</Link>
      </div>
    </div>
  );
}

export default ProductDetail;
