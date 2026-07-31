import React, { useEffect } from 'react';
import OTPInput from './OTPInput';
import { useOtpTimer } from '@/hooks/useOtpTimer';

interface OTPFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onResend?: () => Promise<void>;
  error?: boolean;
  helperText?: string;
  timer?: number;
  timerKey: string;
  email?: string;
  otpType?: string;
  autoStartOnFirstMount?: boolean;
}

const OTPField: React.FC<OTPFieldProps> = ({
  id,
  name: _name,
  label,
  value,
  onChange,
  onResend,
  error,
  helperText,
  timer = 60,
  timerKey,
  email,
  otpType,
  autoStartOnFirstMount = true,
}) => {
  const { timeLeft, startTimer, timerKey: effectiveKey } = useOtpTimer(
    {
      key: timerKey,
      email,
      type: otpType,
      defaultDuration: timer,
    },
    timer
  );



  const handleResend = async () => {
    if (!onResend || timeLeft > 0) return;
    try {
      await onResend();
      startTimer(timer);
    } catch (err) {
      // Khi API báo lỗi (vd: rate limited), tự động kích hoạt cooldown 60s để khóa nút chống spam
      startTimer(timer);
      throw err;
    }
  };

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
        onResend={onResend ? handleResend : undefined}
        error={error}
        timeLeft={timeLeft}
      />

      {helperText && (
        <p
          className={`mt-2 text-center text-[12px] ${
            error ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default OTPField;