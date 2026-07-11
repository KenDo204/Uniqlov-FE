import { useState, useEffect, useCallback } from 'react';

export function useOtpTimer(storageKey: string, defaultDuration: number = 60) {
    const [timeLeft, setTimeLeft] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const exp = parseInt(stored, 10);
            const remain = Math.floor((exp - Date.now()) / 1000);
            return remain > 0 ? remain : 0;
        }
        return 0;
    });

    const calculateRemaining = useCallback(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const exp = parseInt(stored, 10);
            const remain = Math.floor((exp - Date.now()) / 1000);
            return remain > 0 ? remain : 0;
        }
        return 0;
    }, [storageKey]);

    useEffect(() => {
        const updateTimer = () => {
            const remain = calculateRemaining();
            setTimeLeft(remain);
            if (remain <= 0) {
                localStorage.removeItem(storageKey);
            }
        };

        // Chạy ngay lần đầu
        updateTimer();

        // Chạy interval mỗi giây để kiểm tra và cập nhật thời gian
        const interval = setInterval(updateTimer, 1000);

        // Lắng nghe sự thay đổi của localStorage (khi user mở nhiều tab)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === storageKey) {
                updateTimer();
            }
        };
        window.addEventListener('storage', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorage);
        };
    }, [storageKey, calculateRemaining]);

    const startTimer = useCallback((duration: number = defaultDuration) => {
        const exp = Date.now() + duration * 1000;
        localStorage.setItem(storageKey, exp.toString());
        setTimeLeft(duration);
    }, [storageKey, defaultDuration]);

    const clearTimer = useCallback(() => {
        localStorage.removeItem(storageKey);
        setTimeLeft(0);
    }, [storageKey]);

    return { timeLeft, isActive: timeLeft > 0, startTimer, clearTimer };
}
