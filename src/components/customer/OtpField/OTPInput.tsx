import React, { type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from 'react';

interface OTPInputProps {
    id: string;
    length: number;
    otp: string;
    setOtp: (otp: string) => void;
    onChange: (otp: string) => void;
    onResend?: () => void;
    error?: boolean;
    timeLeft?: number; 
}

const OTPInput: React.FC<OTPInputProps> = ({ 
    id, 
    otp, 
    setOtp, 
    length, 
    onChange, 
    onResend, 
    error = false, 
    timeLeft = 0
}) => {
    // Tạo mảng hiển thị các ô input
    const otpArray = otp.padEnd(length, ' ').split('').slice(0, length);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const otpChars = otp.split('');

        otpChars[index] = value.substring(value.length - 1);
        const newOtpString = otpChars.join('');

        setOtp(newOtpString);
        onChange(newOtpString);

        if (value && index < length - 1) {
            const nextInput = document.getElementById(`otp-input-${id}-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-input-${id}-${index - 1}`);
                prevInput?.focus();
            }
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
        if (pastedData) {
            setOtp(pastedData);
            onChange(pastedData);
            const focusIndex = Math.min(pastedData.length, length - 1);
            document.getElementById(`otp-input-${id}-${focusIndex}`)?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className='flex justify-center gap-2.5'>
                {otpArray.map((char, index) => (
                    <input
                        key={index}
                        id={`otp-input-${id}-${index}`}
                        type="text"
                        value={char === ' ' ? '' : char}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        maxLength={1}
                        autoComplete="one-time-code"
                        className={`mt-1 block px-2 border ${error ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none text-lg font-bold h-12 w-12 text-center focus:border-theme focus:ring-1 transition-colors`}
                    />
                ))}
            </div>

            {onResend && (
                <div className="text-xs text-center">
                    {timeLeft > 0 ? (
                        <p className="text-gray-500 m-0">
                            Gửi lại mã sau <span className="font-bold text-theme">{timeLeft}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={onResend}
                            className="text-theme font-semibold hover:text-theme-hover transition-colors border-none bg-transparent cursor-pointer p-0 underline underline-offset-2"
                        >
                            Gửi lại mã OTP
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OTPInput;