export interface SliderCreateRequest {
  imageUrl: string;
  targetUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface SliderUpdateRequest {
  imageUrl?: string;
  targetUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface SliderResponse {
  sliderId: number;
  imageUrl: string;
  targetUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}
