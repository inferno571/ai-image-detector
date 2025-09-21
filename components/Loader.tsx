
import React from 'react';

interface LoaderProps {
  large?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ large = false, text }) => {
  const size = large ? 'h-12 w-12' : 'h-5 w-5';
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${size} animate-spin rounded-full border-4 border-solid border-brand-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      {text && <p className="mt-4 text-brand-subtle">{text}</p>}
    </div>
  );
};
