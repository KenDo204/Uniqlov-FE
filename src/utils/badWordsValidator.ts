import { customBadWords } from '@/constants/badWordsList';

export const hasBadWords = (text: string | null | undefined): boolean => {
  if (!text) return false;

  // 1. Tách chuỗi thành mảng token, bỏ qua khoảng trắng và các dấu câu thông dụng
  // Note: Dấu - có thể dính trong từ ghép, nhưng đa số từ cấm tiếng Việt là rời rạc.
  const tokens = text
    .toLowerCase()
    .split(/[\s.,;:!?"'()[\]{}\-]+/)
    .filter(Boolean);

  if (tokens.length === 0) return false;

  for (const badWord of customBadWords) {
    const badTokens = badWord.toLowerCase().split(/\s+/).filter(Boolean);

    if (badTokens.length === 0) continue;

    // Nếu từ cấm chỉ có 1 từ
    if (badTokens.length === 1) {
      if (tokens.includes(badTokens[0])) {
        return true;
      }
    }
    // Nếu từ cấm là 1 cụm từ (nhiều từ)
    else {
      // Trượt cửa sổ kích thước badTokens.length trên mảng tokens
      for (let i = 0; i <= tokens.length - badTokens.length; i++) {
        let match = true;
        for (let j = 0; j < badTokens.length; j++) {
          if (tokens[i + j] !== badTokens[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          return true;
        }
      }
    }
  }

  return false;
};
