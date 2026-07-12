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