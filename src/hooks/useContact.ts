import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { AppDispatch, RootState } from '@/stores/store';
import {
  createContactMessage,
  fetchMyContacts,
  fetchAdminContacts,
  updateContactStatus,
  clearContactError
} from '@/stores/slices/contactSlice';
import type { ContactMessageRequest, ContactMessageStatusRequest } from '@/types/contact';

export const useContact = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    adminContacts,
    myContacts,
    isFetching,
    isSubmitting,
    error
  } = useSelector((state: RootState) => state.contact);

  const sendContact = useCallback((data: ContactMessageRequest) => {
    return dispatch(createContactMessage(data)).unwrap();
  }, [dispatch]);

  const loadMyContacts = useCallback((params: { page?: number; size?: number }) => {
    return dispatch(fetchMyContacts(params)).unwrap();
  }, [dispatch]);

  const loadAdminContacts = useCallback((params: { page?: number; size?: number; status?: string }) => {
    return dispatch(fetchAdminContacts(params)).unwrap();
  }, [dispatch]);

  const changeContactStatus = useCallback((messageId: number, data: ContactMessageStatusRequest) => {
    return dispatch(updateContactStatus({ messageId, data })).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearContactError());
  }, [dispatch]);

  return {
    adminContacts,
    myContacts,
    isFetching,
    isSubmitting,
    error,
    sendContact,
    loadMyContacts,
    loadAdminContacts,
    changeContactStatus,
    clearError
  };
};
