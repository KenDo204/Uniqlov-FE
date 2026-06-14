import { useEffect, useRef } from 'react';

export function useBehaviorTracker() {
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    const handleGlobalClick = () => {
      const now = Date.now();
      // Detect rapid multi-clicks under 300ms
      if (now - lastClickTime.current < 300) {
        clickCount.current += 1;
      } else {
        clickCount.current = 1;
      }
      lastClickTime.current = now;

      if (clickCount.current > 6) {
        console.warn('Security Warning: Click spamming anomaly detected.');
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const validateTransactionRisk = (amount: number) => {
    // Flags transaction requests larger than 50 million VND as high-value/risk.
    if (amount > 50000000) {
      return {
        isRisk: true,
        message: 'Giao dịch trị giá lớn (>50M VNĐ). Vui lòng xác minh bảo mật.',
      };
    }
    return { isRisk: false };
  };

  return { validateTransactionRisk };
}
