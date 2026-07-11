import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '@/services/contactService';
import type { ContactMessageRequest, ContactMessageStatusRequest, ContactMessageResponse } from '@/types/contact';
import type { PageResponse } from '@/types/common/apiResponse';

interface ContactState {
  adminContacts: PageResponse<ContactMessageResponse> | null;
  myContacts: PageResponse<ContactMessageResponse> | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ContactState = {
  adminContacts: null,
  myContacts: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const createContactMessage = createAsyncThunk(
  'contact/create',
  async (data: ContactMessageRequest, { rejectWithValue }) => {
    try {
      const response = await contactService.createContact(data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi gửi liên hệ');
    }
  }
);

export const fetchMyContacts = createAsyncThunk(
  'contact/fetchMy',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await contactService.getMyContacts(params.page, params.size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải lịch sử liên hệ');
    }
  }
);

export const fetchAdminContacts = createAsyncThunk(
  'contact/fetchAdmin',
  async (params: { page?: number; size?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await contactService.getAdminContacts(params.page, params.size, params.status);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách liên hệ');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contact/updateStatus',
  async ({ messageId, data }: { messageId: number; data: ContactMessageStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await contactService.updateContactStatus(messageId, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create Contact
    builder.addCase(createContactMessage.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(createContactMessage.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    builder.addCase(createContactMessage.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // Fetch My Contacts
    builder.addCase(fetchMyContacts.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchMyContacts.fulfilled, (state, action) => {
      state.isFetching = false;
      state.myContacts = action.payload || null;
    });
    builder.addCase(fetchMyContacts.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload as string;
    });

    // Fetch Admin Contacts
    builder.addCase(fetchAdminContacts.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchAdminContacts.fulfilled, (state, action) => {
      state.isFetching = false;
      state.adminContacts = action.payload || null;
    });
    builder.addCase(fetchAdminContacts.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload as string;
    });

    // Update Status
    builder.addCase(updateContactStatus.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateContactStatus.fulfilled, (state, action) => {
      state.isSubmitting = false;
      if (state.adminContacts && state.adminContacts.content) {
        state.adminContacts.content = state.adminContacts.content.map(contact =>
          contact.messageId === action.payload?.messageId ? action.payload : contact
        );
      }
    });
    builder.addCase(updateContactStatus.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
