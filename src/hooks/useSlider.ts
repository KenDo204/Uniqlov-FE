import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { AppDispatch, RootState } from '@/stores/store';
import {
  fetchPublicSliders,
  fetchAdminSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  clearSliderError
} from '@/stores/slices/sliderSlice';
import type { SliderCreateRequest, SliderUpdateRequest } from '@/types/slider';

export const useSlider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    sliders,
    publicSliders,
    isFetching,
    isSubmitting,
    error
  } = useSelector((state: RootState) => state.slider);

  const loadPublicSliders = useCallback(() => {
    return dispatch(fetchPublicSliders()).unwrap();
  }, [dispatch]);

  const loadAdminSliders = useCallback((params: { page?: number; size?: number; sort?: string }) => {
    return dispatch(fetchAdminSliders(params)).unwrap();
  }, [dispatch]);

  const createNewSlider = useCallback((data: SliderCreateRequest) => {
    return dispatch(createSlider(data)).unwrap();
  }, [dispatch]);

  const editSlider = useCallback((sliderId: number, data: SliderUpdateRequest) => {
    return dispatch(updateSlider({ sliderId, data })).unwrap();
  }, [dispatch]);

  const removeSlider = useCallback((sliderId: number) => {
    return dispatch(deleteSlider(sliderId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearSliderError());
  }, [dispatch]);

  return {
    sliders,
    publicSliders,
    isFetching,
    isSubmitting,
    error,
    loadPublicSliders,
    loadAdminSliders,
    createNewSlider,
    editSlider,
    removeSlider,
    clearError
  };
};
