import React from 'react';
import { Typography, TextField } from '@mui/material';

interface VariantDefaultInputsProps {
  price: string;
  setPrice: (val: string) => void;
  costPrice: string;
  setCostPrice: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  onDirty: () => void;
}

export const VariantDefaultInputs: React.FC<VariantDefaultInputsProps> = ({
  price, setPrice, costPrice, setCostPrice, stock, setStock, onDirty
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
      <Typography variant="subtitle2" className="font-bold text-gray-700">
        Giá trị mặc định cho biến thể mới
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TextField
          label="Giá bán mặc định (VND)"
          type="number"
          variant="outlined"
          fullWidth
          value={price}
          onChange={(e) => { setPrice(e.target.value); onDirty(); }}
          size="small"
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Giá vốn mặc định (VND)"
          type="number"
          variant="outlined"
          fullWidth
          value={costPrice}
          onChange={(e) => { setCostPrice(e.target.value); onDirty(); }}
          size="small"
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Tồn kho mặc định"
          type="number"
          variant="outlined"
          fullWidth
          value={stock}
          onChange={(e) => { setStock(e.target.value); onDirty(); }}
          size="small"
          slotProps={{ htmlInput: { min: -1 } }}
        />
      </div>
    </div>
  );
};
