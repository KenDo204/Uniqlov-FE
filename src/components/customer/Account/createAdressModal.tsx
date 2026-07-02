import { useState, useEffect, type Dispatch, type SetStateAction, type FormEvent } from 'react';
import { useAddress } from '@/hooks/useAddress';
import { useGhn } from '@/hooks/useGhn';
import { addressSchema } from '@/schemas/addressSchema';
import { toast } from 'react-toastify';
import { hasBadWords } from '@/utils/profanity';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stack,
  Box
} from '@mui/material';

interface CreateAddressModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateAddressModal = ({ open, setOpen }: CreateAddressModalProps) => {
  const { createAddress, fetchAddresses } = useAddress();
  const { 
    provinces, 
    districts, 
    wards, 
    fetchProvinces, 
    fetchDistricts, 
    fetchWards, 
    clearDistrictsWards, 
    clearWardsList 
  } = useGhn();

  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState<number | ''>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('');
  const [selectedWard, setSelectedWard] = useState<string | ''>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      fetchProvinces();
      setRecipientName('');
      setPhone('');
      setStreetNumber('');
      setIsDefault(false);
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setErrors({});
      clearDistrictsWards();
    }
  }, [open, fetchProvinces, clearDistrictsWards]);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(Number(selectedProvince));
      setSelectedDistrict('');
      setSelectedWard('');
      clearWardsList();
    } else {
      setSelectedDistrict('');
      setSelectedWard('');
      clearDistrictsWards();
    }
  }, [selectedProvince, fetchDistricts, clearDistrictsWards, clearWardsList]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(Number(selectedDistrict));
      setSelectedWard('');
    } else {
      setSelectedWard('');
      clearWardsList();
    }
  }, [selectedDistrict, fetchWards, clearWardsList]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (hasBadWords(recipientName || "")) {
      toast.error("Tên người nhận chứa từ ngữ không phù hợp!");
      return;
    }

    if (hasBadWords(streetNumber || "")) {
      toast.error("Địa chỉ chi tiết chứa từ ngữ không phù hợp!");
      return;
    }

    const validationResult = addressSchema.safeParse({
      recipientName,
      phone,
      provinceId: selectedProvince === '' ? undefined : Number(selectedProvince),
      districtId: selectedDistrict === '' ? undefined : Number(selectedDistrict),
      wardCode: selectedWard === '' ? undefined : String(selectedWard),
      streetNumber,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        formattedErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(formattedErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      await createAddress({
        recipientName,
        phone,
        provinceId: Number(selectedProvince),
        districtId: Number(selectedDistrict),
        wardCode: String(selectedWard),
        streetNumber,
        isDefault
      });
      toast.success("Thêm địa chỉ mới thành công!");
      setOpen(false);
      fetchAddresses();
    } catch (err: any) {
      toast.error(err || "Lỗi khi tạo địa chỉ");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', mb: 2, fontWeight: 'medium' }}>
        Địa chỉ mới
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Họ và tên"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                fullWidth
                size="small"
                error={!!errors.recipientName}
                helperText={errors.recipientName}
              />
              <TextField
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                type="tel"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Box>

            <TextField
              select
              label="Tỉnh/Thành phố"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(Number(e.target.value))}
              fullWidth
              size="small"
              error={!!errors.provinceId}
              helperText={errors.provinceId}
            >
              <MenuItem value="" disabled>
                Tỉnh/Thành phố
              </MenuItem>
              {Array.isArray(provinces) && provinces.map((p) => (
                <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Quận/Huyện"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(Number(e.target.value))}
              fullWidth
              size="small"
              disabled={!selectedProvince}
              error={!!errors.districtId}
              helperText={errors.districtId}
            >
              <MenuItem value="" disabled>
                Quận/Huyện
              </MenuItem>
              {Array.isArray(districts) && districts.map((d) => (
                <MenuItem key={d.DistrictID} value={d.DistrictID}>
                  {d.DistrictName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Phường/Xã"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              fullWidth
              size="small"
              disabled={!selectedDistrict}
              error={!!errors.wardCode}
              helperText={errors.wardCode}
            >
              <MenuItem value="" disabled>
                Phường/Xã
              </MenuItem>
              {Array.isArray(wards) && wards.map((w) => (
                <MenuItem key={w.WardCode} value={w.WardCode}>
                  {w.WardName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Địa chỉ cụ thể"
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Số nhà, đường, ngõ..."
              error={!!errors.streetNumber}
              helperText={errors.streetNumber}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  color="primary"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-checked': {
                      color: 'var(--color-theme)',
                    },
                  }}
                />
              }
              label="Đặt làm địa chỉ mặc định"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: 'var(--color-cancel)',
              borderColor: 'var(--color-cancel)',
              fontWeight: 'medium',
              fontSize: '14px',
              textTransform: 'uppercase',
              '&:hover': {
                color: 'var(--color-cancel-hover)',
                borderColor: 'var(--color-cancel-hover)',
                bgcolor: 'rgba(211, 47, 47, 0.04)',
              }
            }}
          >
            Trở lại
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              bgcolor: 'var(--color-theme)',
              color: 'white',
              fontWeight: 'medium',
              fontSize: '14px',
              textTransform: 'uppercase',
              '&:hover': {
                bgcolor: 'var(--color-theme-hover)',
              }
            }}
          >
            Hoàn thành
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAddressModal;
