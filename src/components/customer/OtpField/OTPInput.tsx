import React, { type ChangeEvent, type KeyboardEvent, type ClipboardEvent, useState, useEffect } from 'react';

interface OTPInputProps {
    id: string;
    length: number;
    otp: string;
    setOtp: (otp: string) => void;
    onChange: (otp: string) => void;
    onResend?: () => Promise<void>;
    error?: boolean;
    timer?: number; 
}

const OTPInput: React.FC<OTPInputProps> = ({ 
    id, 
    otp, 
    setOtp, 
    length, 
    onChange, 
    onResend, 
    error = false, 
    timer = 60 // Đặt mặc định là 60s luôn cho chắc cú
}) => {
    const [localTimer, setLocalTimer] = useState(0);
    const storageKey = `otp_timestamp_${id}`;

    // ── XỬ LÝ KHI VỪA RENDER (Lần đầu tiên HOẶC sau khi F5) ─────────────────
    useEffect(() => {
        const savedTimeStr = localStorage.getItem(storageKey);
        
        if (savedTimeStr) {
            // KỊCH BẢN 1: Đã có lịch sử (F5 tải lại trang)
            const savedTimestamp = parseInt(savedTimeStr, 10);
            const now = Date.now();
            const diffSeconds = Math.floor((now - savedTimestamp) / 1000);

            if (diffSeconds < timer) {
                setLocalTimer(timer - diffSeconds);
            } else {
                setLocalTimer(0);
                localStorage.removeItem(storageKey);
            }
        } else if (timer > 0) {
            // KỊCH BẢN 2: Lần đầu tiên xuất hiện (chưa có lịch sử)
            // -> Tự động bắt đầu đếm ngược và ghi nhận mốc thời gian
            setLocalTimer(timer);
            localStorage.setItem(storageKey, Date.now().toString());
        }
    }, [id, timer, storageKey]);

    // ── BỘ CHẠY ĐẾM NGƯỢC TỰ ĐỘNG ───────────────────────────────────────────
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (localTimer > 0) {
            interval = setInterval(() => {
                setLocalTimer((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem(storageKey);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [localTimer, storageKey]);

    // ── XỬ LÝ KHI BẤM NÚT GỬI LẠI ───────────────────────────────────────────
    const handleResend = async () => {
        if (localTimer > 0 || !onResend) return;

        try {
            await onResend();
            localStorage.setItem(storageKey, Date.now().toString());
            setLocalTimer(timer);
        } catch (err: any) {
            console.error("Lỗi gửi lại mã OTP:", err);
        }
    };

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
                    {localTimer > 0 ? (
                        <p className="text-gray-500 m-0">
                            Gửi lại mã sau <span className="font-bold text-theme">{localTimer}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
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