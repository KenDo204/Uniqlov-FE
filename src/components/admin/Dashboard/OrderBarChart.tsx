import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { OrderStatsDto } from '@/types/dashboard/response';

interface OrderBarChartProps {
  orderStats?: OrderStatsDto;
}

export const OrderBarChart: React.FC<OrderBarChartProps> = ({ orderStats }) => {
  const chartData = useMemo(() => {
    return [
      { name: 'Chờ xử lý', count: orderStats?.totalPendingOrders || 0, color: '#f59e0b' },
      { name: 'Thành công', count: orderStats?.totalSuccessOrders || 0, color: '#10b981' },
      { name: 'Thất bại', count: orderStats?.totalFailedOrders || 0, color: '#ef4444' },
    ];
  }, [orderStats]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        bgcolor: '#ffffff',
        height: '100%',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
          Thống kê đơn hàng
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Số lượng đơn hàng theo từng trạng thái hệ thống
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: any) => [`${value} đơn hàng`, 'Số lượng']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
            />
            <Bar dataKey="count" name="Số lượng đơn" radius={[8, 8, 0, 0]} barSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
