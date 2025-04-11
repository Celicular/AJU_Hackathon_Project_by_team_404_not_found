'use client';

import React from 'react';

export function Progress({ value = 0, className = '', ...props }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`} {...props}>
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
} 