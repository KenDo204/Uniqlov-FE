import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseOtpTimerOptions {
  key?: string;
  email?: string;
  type?: string;
  defaultDuration?: number;
}

/**
 * Custom hook quản lý OTP Countdown Timer dựa trên mốc thời gian thực (Timestamp).
 * Hỗ trợ tự động tính lại số giây còn lại sau F5 / Reload và đồng bộ realtime qua nhiều Tab.
 */
export function useOtpTimer(
  keyOrOptions: string | UseOtpTimerOptions,
  defaultDuration: number = 60
) {
  const options = useMemo<UseOtpTimerOptions>(() => {
    if (typeof keyOrOptions === 'string') {
      return { key: keyOrOptions, defaultDuration };
    }
    return { defaultDuration, ...keyOrOptions };
  }, [keyOrOptions, defaultDuration]);

  const effectiveKey = useMemo(() => {
    const email = options.email?.trim().toLowerCase();
    const type = options.type?.trim().toUpperCase();
    if (email && type) {
      return `otp_exp_${type}_${email}`;
    }
    return options.key || 'otp_default_timer';
  }, [options.email, options.type, options.key]);

  const durationSetting = options.defaultDuration || defaultDuration;

  const calculateRemaining = useCallback(() => {
    if (!effectiveKey) return 0;
    const stored = localStorage.getItem(effectiveKey);
    if (stored) {
      const exp = parseInt(stored, 10);
      if (!isNaN(exp)) {
        const remain = Math.ceil((exp - Date.now()) / 1000);
        return remain > 0 ? remain : 0;
      }
    }
    return 0;
  }, [effectiveKey]);

  const [timeLeft, setTimeLeft] = useState<number>(() => calculateRemaining());

  useEffect(() => {
    const updateTimer = () => {
      const remain = calculateRemaining();
      setTimeLeft(remain);
      if (remain <= 0 && localStorage.getItem(effectiveKey)) {
        localStorage.removeItem(effectiveKey);
      }
    };

    // Kiểm tra ngay khi mount
    updateTimer();

    // Chạy interval mỗi 1000ms để đếm lùi
    const interval = setInterval(updateTimer, 1000);

    // Lắng nghe sự thay đổi của localStorage giữa nhiều tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === effectiveKey) {
        updateTimer();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [effectiveKey, calculateRemaining]);

  const startTimer = useCallback(
    (duration: number = durationSetting) => {
      if (!effectiveKey) return;
      const exp = Date.now() + duration * 1000;
      localStorage.setItem(effectiveKey, exp.toString());
      setTimeLeft(duration);

      // Dispatch custom event để đồng bộ cùng tab nếu có nhiều component
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: effectiveKey,
          newValue: exp.toString(),
        })
      );
    },
    [effectiveKey, durationSetting]
  );

  const clearTimer = useCallback(() => {
    if (!effectiveKey) return;
    localStorage.removeItem(effectiveKey);
    setTimeLeft(0);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: effectiveKey,
        newValue: null,
      })
    );
  }, [effectiveKey]);

  return {
    timeLeft,
    isActive: timeLeft > 0,
    startTimer,
    clearTimer,
    timerKey: effectiveKey,
  };
}
