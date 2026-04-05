import React from 'react';

const SectionTitle = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
