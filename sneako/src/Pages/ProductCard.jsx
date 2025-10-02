import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    
    const isNewArrival = parseInt(product.id, 10) > 15; 
    
    const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;

    return (
        <div
            className="group relative border border-gray-100 rounded-xl shadow-lg bg-white overflow-hidden transition duration-300 hover:shadow-2xl"
        >
            {isNewArrival && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    NEW ARRIVAL
                </span>
            )}
            
            <Link to={`/product/${product.id}`} className="block">
                
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="p-4 flex flex-col justify-between h-auto">
                    
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            {product.category}
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
                            {product.name}
                        </h2>
                    </div>
                    
                    <div className="mt-2">
                        <p className="text-2xl font-extrabold text-black mb-4">
                            {formattedPrice}
                        </p>
                        
                       
                        <button
                            className="mt-3 w-full bg-black text-white py-2 rounded-lg font-semibold 
                                       hover:bg-gray-800 transition duration-300 transform shadow-md"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;