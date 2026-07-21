import React from 'react';
import { 
  TextField, 
  Switch, 
  FormControlLabel, 
  Typography, 
  Box,
  InputAdornment
} from '@mui/material';
import { Tag } from '@mui/icons-material';

interface SliderDisplaySettingsProps {
  displayOrder: string;
  setDisplayOrder: (val: string) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  disabled?: boolean;
}

export const SliderDisplaySettings: React.FC<SliderDisplaySettingsProps> = ({
  displayOrder,
  setDisplayOrder,
  isActive,
  setIsActive,
  disabled = false
}) => {
  return (
    <Box className="space-y-6">
      <div>
        <Typography variant="body2" className="text-gray-700 font-medium mb-2 text-[14px]">Thứ tự hiển thị</Typography>
        <TextField
          fullWidth
          type="number"
          variant="outlined"
          value={displayOrder}
          disabled={disabled}
          onChange={(e) => setDisplayOrder(e.target.value)}
          slotProps={{ 
            htmlInput: { min: 0 },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Tag className="text-gray-400" fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-theme)',
                borderWidth: '2px'
              },
            }
          }}
        />
        <Typography variant="caption" className="text-gray-500 mt-2 block text-[13px]">
          Slider có thứ tự nhỏ hơn sẽ được ưu tiên hiển thị trước (Vd: 0, 1, 2)
        </Typography>
      </div>

      <Box className={`p-4 rounded-xl border border-gray-100 flex items-start justify-between gap-4 transition-colors ${isActive ? 'bg-[#00927c]/5 border-[#00927c]/20' : 'bg-gray-50/50'}`}>
        <div>
          <Typography className={`font-semibold text-[15px] ${isActive ? 'text-[#00927c]' : 'text-gray-800'}`}>
            Hiển thị Slider
          </Typography>
          <Typography variant="caption" className="text-gray-500 mt-1 block text-[13px] leading-relaxed">
            Slider sẽ được hiển thị ngoài Website.<br/>
            Nếu OFF, Slider sẽ bị ẩn khỏi người dùng.
          </Typography>
        </div>
        <FormControlLabel
          disabled={disabled}
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              sx={{
                width: 50,
                height: 28,
                padding: 0,
                marginRight: 1,
                '& .MuiSwitch-switchBase': {
                  padding: 0,
                  margin: '2px',
                  transitionDuration: '300ms',
                  '&.Mui-checked': {
                    transform: 'translateX(22px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                      backgroundColor: 'var(--color-theme)',
                      opacity: 1,
                      border: 0,
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                      opacity: 0.5,
                    },
                  },
                  '&.Mui-focusVisible .MuiSwitch-thumb': {
                    color: 'var(--color-theme)',
                    border: '6px solid #fff',
                  },
                  '&.Mui-disabled .MuiSwitch-thumb': {
                    color: 'gray',
                  },
                },
                '& .MuiSwitch-thumb': {
                  boxSizing: 'border-box',
                  width: 24,
                  height: 24,
                  boxShadow: '0 2px 4px 0 rgba(0 35 11 / 20%)',
                },
                '& .MuiSwitch-track': {
                  borderRadius: 28 / 2,
                  backgroundColor: '#E9E9EA',
                  opacity: 1,
                  transition: 'background-color 300ms',
                },
              }}
            />
          }
          label=""
          className="m-0 mt-1"
        />
      </Box>
    </Box>
  );
};
