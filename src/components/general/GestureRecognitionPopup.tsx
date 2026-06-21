import { useEffect, useMemo, useRef, useState } from 'react';
import {
    FilesetResolver,
    GestureRecognizer,
    type GestureRecognizerResult,
} from '@mediapipe/tasks-vision';

type GestureDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';
type GestureAction =
    | 'SCROLL_UP'
    | 'SCROLL_DOWN'
    | 'PREVIOUS_ITEM'
    | 'NEXT_ITEM'
    | 'STOP'
    | 'SELECT'
    | 'NO_ACTION';

type Landmark = {
    x: number;
    y: number;
    z?: number;
};

interface RecognizedAction {
    code: GestureAction;
    label: string;
    confidence: number;
}

interface GestureRecognitionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    onActionChange?: (action: RecognizedAction) => void;
}

const MODEL_ASSET_URL =
    'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
// Ngưỡng tin cậy tối thiểu cho các gesture tổng quát (ví dụ Open_Palm).
const MIN_GESTURE_CONFIDENCE = 0.45;
// Nắm tay thường khó ổn định hơn nên cho ngưỡng riêng thấp hơn một chút.
const MIN_FIST_CONFIDENCE = 0.35;
// Số frame liên tiếp cần giữ cùng hành động trước khi cập nhật state.
const STABLE_FRAMES_REQUIRED = 3;
// Ngón trỏ phải "trội" hơn các ngón còn lại để tránh nhận nhầm khi tay nghỉ.
const INDEX_DOMINANCE_RATIO = 1.5;
// Deadzone pixel để lọc rung tay nhỏ (jitter) theo trục ngang/dọc.
const HORIZONTAL_DEADZONE_PX = 40;
const VERTICAL_DEADZONE_PX = 40;
const MIN_PALM_DEPTH_DELTA = 0.0025;

const createNoAction = (): RecognizedAction => ({
    code: 'NO_ACTION',
    label: 'Đang chờ cử chỉ...',
    confidence: 0,
});

/*
 * Muc dich:
 * - Chuyen ma hanh dong (GestureAction) thanh chuoi tieng Viet de hien thi UI.
 * Input:
 * - action: ma hanh dong dang duoc nhan dien.
 * Output:
 * - Chuoi mo ta hanh dong de hien thi cho nguoi dung.
 */
const mapActionToLabel = (action: GestureAction): string => {
    switch (action) {
        case 'SCROLL_UP':
            return 'Cuộn lên';
        case 'SCROLL_DOWN':
            return 'Cuộn xuống';
        case 'PREVIOUS_ITEM':
            return 'Qua mục bên trái';
        case 'NEXT_ITEM':
            return 'Qua mục bên phải';
        case 'STOP':
            return 'Dừng';
        case 'SELECT':
            return 'Chọn';
        default:
            return 'Đang chờ cử chỉ...';
    }
};

// Tính khoảng cách Euclid 2D giữa 2 landmark.
/*
 * Muc dich:
 * - Tinh khoang cach 2D giua hai diem landmark.
 * Input:
 * - a, b: hai landmark gom toa do x/y.
 * Output:
 * - Gia tri khoang cach (so thuc duong).
 */
const distance = (a: Landmark, b: Landmark): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
};

// Lấy trung bình chiều sâu z của một nhóm landmark để giảm nhiễu từng điểm.
/*
 * Muc dich:
 * - Tinh trung binh chieu sau z cua mot nhom diem de giam nhieu.
 * Input:
 * - landmarks: mang landmark cua ban tay.
 * - indices: danh sach index can lay z.
 * Output:
 * - Gia tri z trung binh (neu khong co du lieu thi tra ve 0).
 */
const averageDepth = (landmarks: Landmark[], indices: number[]): number => {
    const values = indices
        .map((index) => landmarks[index]?.z)
        .filter((value): value is number => typeof value === 'number');

    if (values.length === 0) {
        return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

/*
 * Muc dich:
 * - Uoc luong huong long ban tay khi nam tay de loc truong hop mu ban tay.
 * Input:
 * - landmarks: mang landmark cua ban tay (co truong z).
 * Output:
 * - true neu xu huong la long ban tay huong camera, false neu nguoc lai.
 */
const isPalmFacingCameraForFist = (landmarks: Landmark[]): boolean => {
    // With MediaPipe hand landmarks, smaller z values are typically closer to camera.
    // Palm-facing fist usually makes the palm base closer than curled fingertips.
    const palmBaseDepth = averageDepth(landmarks, [0, 5, 9, 13, 17]);
    const fingertipDepth = averageDepth(landmarks, [8, 12, 16, 20]);
    const depthDelta = fingertipDepth - palmBaseDepth;

    // If depth info is missing/noisy, avoid blocking SELECT completely.
    if (Math.abs(depthDelta) < 1e-6) {
        return true;
    }

    // Depth from webcam is often noisy. Keep strict reject only when it strongly
    // indicates backhand; otherwise allow to avoid missing valid fist gestures.
    return depthDelta > -MIN_PALM_DEPTH_DELTA;
};

// Với SELECT, ta cho phép phản hồi nhanh hơn các gesture khác.
/*
 * Muc dich:
 * - Quy dinh so frame can on dinh cho tung loai action.
 * Input:
 * - actionCode: ma hanh dong dang xet.
 * Output:
 * - So frame can giong nhau lien tiep truoc khi chap nhan action.
 */
const getRequiredStableFrames = (actionCode: GestureAction): number => {
    if (actionCode === 'SELECT') {
        return 1;
    }

    return STABLE_FRAMES_REQUIRED;
};

// Kiểm tra ngón trỏ có thực sự vươn ra rõ ràng so với các ngón còn lại hay không.
/*
 * Muc dich:
 * - Kiem tra cu chi "chi ngon tro" co ro rang hay khong.
 * Input:
 * - landmarks: mang landmark cua ban tay.
 * Output:
 * - true neu ngon tro dai/tron hon ro so voi cac ngon con lai, false neu khong.
 */
const isIndexFingerDominant = (landmarks: Landmark[]): boolean => {
    const indexBase = landmarks[5];
    const indexTip = landmarks[8];
    const middleBase = landmarks[9];
    const middleTip = landmarks[12];
    const ringBase = landmarks[13];
    const ringTip = landmarks[16];
    const pinkyBase = landmarks[17];
    const pinkyTip = landmarks[20];

    if (
        !indexBase ||
        !indexTip ||
        !middleBase ||
        !middleTip ||
        !ringBase ||
        !ringTip ||
        !pinkyBase ||
        !pinkyTip
    ) {
        return false;
    }

    const indexLength = distance(indexBase, indexTip);
    const otherAverage =
        (distance(middleBase, middleTip) +
            distance(ringBase, ringTip) +
            distance(pinkyBase, pinkyTip)) /
        3;

    if (otherAverage <= 0) {
        return false;
    }

    return indexLength > otherAverage * INDEX_DOMINANCE_RATIO;
};

// Map vùng góc về 4 hướng chính; các góc chéo được xem là NONE để tránh sai lệnh.
/*
 * Muc dich:
 * - Chuyen goc vector sang huong roi rac (UP/DOWN/LEFT/RIGHT).
 * Input:
 * - angle: goc da duoc chuan hoa trong khoang [0, 360).
 * Output:
 * - Huong gesture ung voi goc; neu nam o vung cheo thi tra ve NONE.
 */
const classifyDirectionByAngle = (angle: number): GestureDirection => {
    if (angle >= 70 && angle <= 110) {
        return 'UP';
    }

    if (angle >= 250 && angle <= 290) {
        return 'DOWN';
    }

    if (angle >= 160 && angle <= 200) {
        return 'LEFT';
    }

    if (angle <= 20 || angle >= 340) {
        return 'RIGHT';
    }

    return 'NONE';
};

/*
 * Muc dich:
 * - Suy ra huong chi ngon tro tu landmarks, co xu ly mirror va deadzone.
 * Input:
 * - landmarks: du lieu moc diem ban tay.
 * - isMirrored: camera dang lat guong hay khong.
 * - frameWidth, frameHeight: kich thuoc khung hinh video de doi sang pixel.
 * Output:
 * - Huong gesture (UP/DOWN/LEFT/RIGHT/NONE).
 */
const getPointingDirection = (
    landmarks: Landmark[] | undefined,
    isMirrored: boolean,
    frameWidth: number,
    frameHeight: number,
): GestureDirection => {
    if (!landmarks || landmarks.length < 9) {
        return 'NONE';
    }

    if (!isIndexFingerDominant(landmarks)) {
        return 'NONE';
    }

    const indexBase = landmarks[5] ?? landmarks[0];
    const indexTip = landmarks[8];

    if (!indexBase || !indexTip) {
        return 'NONE';
    }

    let deltaX = indexTip.x - indexBase.x;
    const deltaY = indexTip.y - indexBase.y;

    if (isMirrored) {
        // Camera gương làm trái/phải bị đảo, nên cần đảo dấu trục X để đúng hướng người dùng.
        deltaX *= -1;
    }

    // MediaPipe trả về tọa độ chuẩn hóa [0..1], đổi sang pixel để deadzone dễ kiểm soát.
    const deltaXInPx = deltaX * frameWidth;
    const deltaYInPx = deltaY * frameHeight;
    const absX = Math.abs(deltaXInPx);
    const absY = Math.abs(deltaYInPx);

    if (absX < HORIZONTAL_DEADZONE_PX && absY < VERTICAL_DEADZONE_PX) {
        return 'NONE';
    }

    // Dùng atan2 để lấy góc vector ngón trỏ theo hệ trục màn hình.
    const angle = (Math.atan2(-deltaYInPx, deltaXInPx) * 180) / Math.PI;
    const normalizedAngle = (angle + 360) % 360;
    const direction = classifyDirectionByAngle(normalizedAngle);

    if (direction === 'LEFT' || direction === 'RIGHT') {
        return absX >= HORIZONTAL_DEADZONE_PX ? direction : 'NONE';
    }

    if (direction === 'UP' || direction === 'DOWN') {
        return absY >= VERTICAL_DEADZONE_PX ? direction : 'NONE';
    }

    return 'NONE';
};

/*
 * Muc dich:
 * - Hop nhat ket qua category + landmarks de tra ve action cuoi cung.
 * Input:
 * - categoryName: nhan category cua model (Open_Palm, Closed_Fist, ...).
 * - confidence: do tin cay category.
 * - landmarks: moc diem ban tay.
 * - isMirrored: camera dang lat guong hay khong.
 * - frameWidth, frameHeight: kich thuoc video de tinh deadzone theo pixel.
 * Output:
 * - Action da duoc map cho UI va business logic.
 */
const inferAction = (
    categoryName: string,
    confidence: number,
    landmarks: Landmark[] | undefined,
    isMirrored: boolean,
    frameWidth: number,
    frameHeight: number,
): RecognizedAction => {
    // Ưu tiên nhận diện cử chỉ đặc biệt trước khi tính hướng vector.
    if (categoryName === 'Open_Palm' && confidence >= MIN_GESTURE_CONFIDENCE) {
        return {
            code: 'STOP',
            label: mapActionToLabel('STOP'),
            confidence,
        };
    }

    if (categoryName === 'Closed_Fist' && confidence >= MIN_FIST_CONFIDENCE) {
        // Chỉ cho SELECT khi nắm tay và lòng bàn tay có xu hướng hướng camera.
        if (landmarks && landmarks.length >= 21 && isPalmFacingCameraForFist(landmarks)) {
            return {
                code: 'SELECT',
                label: mapActionToLabel('SELECT'),
                confidence,
            };
        }

        if (confidence >= 0.65) {
            // Fallback: nếu model tự tin rất cao thì vẫn cho SELECT để tránh bỏ lỡ.
            return {
                code: 'SELECT',
                label: mapActionToLabel('SELECT'),
                confidence,
            };
        }

        return createNoAction();
    }

    if (!landmarks || landmarks.length < 9) {
        return createNoAction();
    }

    const direction = getPointingDirection(landmarks, isMirrored, frameWidth, frameHeight);
    const forgivingConfidence = confidence > 0 ? confidence : MIN_GESTURE_CONFIDENCE;

    switch (direction) {
        case 'UP':
            return {
                code: 'SCROLL_UP',
                label: mapActionToLabel('SCROLL_UP'),
                confidence: forgivingConfidence,
            };
        case 'DOWN':
            return {
                code: 'SCROLL_DOWN',
                label: mapActionToLabel('SCROLL_DOWN'),
                confidence: forgivingConfidence,
            };
        case 'LEFT':
            return {
                code: 'PREVIOUS_ITEM',
                label: mapActionToLabel('PREVIOUS_ITEM'),
                confidence: forgivingConfidence,
            };
        case 'RIGHT':
            return {
                code: 'NEXT_ITEM',
                label: mapActionToLabel('NEXT_ITEM'),
                confidence: forgivingConfidence,
            };
        default:
            return createNoAction();
    }
};

/*
 * Muc dich:
 * - Popup hien thi camera + thong tin gesture, dong thoi chay toan bo vong lap nhan dien.
 * Input:
 * - isOpen: bat/tat popup.
 * - onClose: callback dong popup.
 * - title: tieu de popup.
 * - onActionChange: callback khi action thay doi.
 * Output:
 * - JSX popup gesture recognition.
 */
const GestureRecognitionPopup = ({
    isOpen,
    onClose,
    title = 'Điều khiển cử chỉ',
    onActionChange,
}: GestureRecognitionPopupProps) => {
    // Các ref dưới đây giữ tài nguyên chạy nền (video/stream/model/raf) qua mỗi render.
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const recognizerRef = useRef<GestureRecognizer | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);
    const mirrorRef = useRef<boolean>(true);
    const actionChangeRef = useRef<GestureRecognitionPopupProps['onActionChange']>(undefined);
    const candidateActionRef = useRef<RecognizedAction>(createNoAction());
    const stableFrameCountRef = useRef<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isMirrored, setIsMirrored] = useState<boolean>(true);
    const [currentAction, setCurrentAction] = useState<RecognizedAction>(createNoAction);

    useEffect(() => {
        mirrorRef.current = isMirrored;
    }, [isMirrored]);

    useEffect(() => {
        actionChangeRef.current = onActionChange;
    }, [onActionChange]);

    const popupStyle = useMemo(
        () => ({
            position: 'fixed' as const,
            right: '16px',
            bottom: '16px',
            zIndex: 9999,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' as const : 'none' as const,
            transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
        }),
        [isOpen],
    );

    // Dọn toàn bộ tài nguyên media + model để tránh memory leak khi đóng popup/unmount.
    /*
     * Muc dich:
     * - Thu hoi toan bo tai nguyen camera/model/animation frame mot cach an toan.
     * Input:
     * - Khong co (su dung du lieu tu ref).
     * Output:
     * - Khong tra ve; chi thuc hien side effects cleanup.
     */
    const resetDetectionResources = () => {
        if (frameIdRef.current !== null) {
            cancelAnimationFrame(frameIdRef.current);
            frameIdRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        if (recognizerRef.current) {
            recognizerRef.current.close();
            recognizerRef.current = null;
        }

        lastVideoTimeRef.current = -1;
        candidateActionRef.current = createNoAction();
        stableFrameCountRef.current = 0;
    };

    // Chỉ cập nhật currentAction khi hành động đủ ổn định trong nhiều frame liên tiếp.
    /*
     * Muc dich:
     * - Giam giat UI bang cach chi chap nhan action khi on dinh qua nhieu frame.
     * Input:
     * - nextAction: action moi vua tinh duoc tu frame hien tai.
     * Output:
     * - Khong tra ve; cap nhat state currentAction va callback neu du dieu kien.
     */
    const updateActionWithStability = (nextAction: RecognizedAction) => {
        const previousCandidate = candidateActionRef.current;
        const isSameCandidate = previousCandidate.code === nextAction.code;

        if (isSameCandidate) {
            stableFrameCountRef.current += 1;
            candidateActionRef.current = {
                ...nextAction,
                confidence: Math.max(previousCandidate.confidence, nextAction.confidence),
            };
        } else {
            candidateActionRef.current = nextAction;
            stableFrameCountRef.current = 1;
        }

        const requiredFrames = getRequiredStableFrames(candidateActionRef.current.code);
        if (stableFrameCountRef.current < requiredFrames) {
            return;
        }

        const stableAction = candidateActionRef.current;
        setCurrentAction((prev) => {
            const confidenceDelta = Math.abs(prev.confidence - stableAction.confidence);
            const isChanged = prev.code !== stableAction.code || confidenceDelta > 0.08;
            if (isChanged) {
                actionChangeRef.current?.(stableAction);
                return stableAction;
            }
            return prev;
        });
    };

    useEffect(() => {
        let isCancelled = false;

        // Khởi tạo MediaPipe + camera khi popup mở.
        const startGestureRecognition = async () => {
            if (!isOpen) {
                resetDetectionResources();
                setCurrentAction(createNoAction());
                setIsLoading(false);
                setError(null);
                return;
            }

            try {
                setError(null);
                setIsLoading(true);

                const videoElement = videoRef.current;
                if (!videoElement) {
                    throw new Error('Video chưa sẵn sàng.');
                }

                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
                );

                if (isCancelled) {
                    return;
                }

                recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: MODEL_ASSET_URL,
                    },
                    runningMode: 'VIDEO',
                    numHands: 1,
                });

                if (isCancelled) {
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                    },
                    audio: false,
                });

                if (isCancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                videoElement.srcObject = stream;
                await videoElement.play();

                const detectFrame = () => {
                    if (isCancelled || !videoRef.current || !recognizerRef.current) {
                        return;
                    }

                    const video = videoRef.current;
                    const recognizer = recognizerRef.current;

                    if (
                        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
                        lastVideoTimeRef.current !== video.currentTime
                    ) {
                        // Chỉ nhận diện khi frame mới thực sự đến để giảm tính toán thừa.
                        lastVideoTimeRef.current = video.currentTime;

                        const result: GestureRecognizerResult = recognizer.recognizeForVideo(
                            video,
                            performance.now(),
                        );

                        const topGesture = result.gestures?.[0]?.[0];
                        const categoryName = topGesture?.categoryName ?? '';
                        const confidence = topGesture?.score ?? 0;
                        const landmarks = result.landmarks?.[0] as Landmark[] | undefined;

                        const recognized = inferAction(
                            categoryName,
                            confidence,
                            landmarks,
                            mirrorRef.current,
                            video.videoWidth || video.clientWidth || 640,
                            video.videoHeight || video.clientHeight || 480,
                        );

                        updateActionWithStability(recognized);
                    }

                    frameIdRef.current = requestAnimationFrame(detectFrame);
                };

                detectFrame();
                setIsLoading(false);
            } catch (caughtError) {
                const message =
                    caughtError instanceof Error
                        ? caughtError.message
                        : 'Không thể khởi tạo camera hoặc model nhận diện.';
                setError(message);
                setIsLoading(false);
                setCurrentAction(createNoAction());
                resetDetectionResources();
            }
        };

        startGestureRecognition();

        return () => {
            isCancelled = true;
            resetDetectionResources();
        };
    }, [isOpen]);

    return (
        <div style={popupStyle}>
            <div
                style={{
                    position: 'relative',
                    width: 'min(90vw, 360px)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#101214',
                    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.38)',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '220px',
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#000',
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
                            transformOrigin: 'center center',
                            background: '#000',
                        }}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            padding: '8px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: '#f3f4f6',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0))',
                            fontSize: '13px',
                            fontWeight: 600,
                        }}
                    >
                        <span>{title}</span>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                border: 'none',
                                borderRadius: '8px',
                                padding: '5px 8px',
                                cursor: 'pointer',
                                color: '#111827',
                                fontWeight: 700,
                                fontSize: '12px',
                            }}
                        >
                            Đóng
                        </button>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(0, 0, 0, 0.45)',
                            borderRadius: '999px',
                            padding: '6px 10px',
                            color: '#e5e7eb',
                            fontSize: '12px',
                        }}
                    >
                        <span>Lật gương</span>
                        <button
                            type="button"
                            onClick={() => setIsMirrored((prev) => !prev)}
                            style={{
                                border: 'none',
                                borderRadius: '999px',
                                padding: '5px 8px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: isMirrored ? '#22c55e' : '#9ca3af',
                                color: '#0f172a',
                                fontSize: '11px',
                            }}
                        >
                            {isMirrored ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            textAlign: 'center',
                            background: 'rgba(17, 24, 39, 0.82)',
                            color: '#f9fafb',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '9px',
                            padding: '8px 10px',
                            backdropFilter: 'blur(3px)',
                            fontSize: '12px',
                            lineHeight: 1.4,
                        }}
                    >
                        <div>
                            Hành động: {currentAction.label}
                            {currentAction.code !== 'NO_ACTION'
                                ? ` (${(currentAction.confidence * 100).toFixed(1)}%)`
                                : ''}
                        </div>
                        <div style={{ marginTop: '4px', opacity: 0.9 }}>
                            {isLoading ? 'Đang khởi tạo model/camera...' : '👆 Lên | 👇 Xuống | 👈 Trái | 👉 Phải | ✋ Dừng | ✊ OK'}
                        </div>
                        {error ? (
                            <div style={{ marginTop: '4px', color: '#fca5a5' }}>Lỗi: {error}</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestureRecognitionPopup;
export type { GestureRecognitionPopupProps, RecognizedAction, GestureAction, GestureDirection };
