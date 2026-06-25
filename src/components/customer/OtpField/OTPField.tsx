import React from 'react';
import OTPInput from './OTPInput';

interface OTPFieldProps {
  id: string; 
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void; // Đổi type để dễ dùng với React Hook Form
  onResend?: () => Promise<void>;
  error?: boolean;
  helperText?: string;
  timer?: number;
}

const OTPField: React.FC<OTPFieldProps> = ({ id, name: _name, label, value, onChange, onResend, error, helperText, timer }) => {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-medium text-gray-800 mb-4 text-center">
        {label}
      </label>
      
      <OTPInput 
        id={id}
        length={6}
        otp={value}
        setOtp={onChange}
        onChange={onChange}
        onResend={onResend}
        error={error}
        timer={timer}
      />

      {helperText && (
        <p className={`mt-2 text-center text-[12px] ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {helperText}
        </p>
      )}
    </div>
  );
};

export default OTPField;