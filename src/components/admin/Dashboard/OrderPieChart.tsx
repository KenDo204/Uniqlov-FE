import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { OrderStatsDto } from '@/types/dashboard/response';

interface OrderPieChartProps {
  orderStats?: OrderStatsDto;
}

export const OrderPieChart: React.FC<OrderPieChartProps> = ({ orderStats }) => {
  const chartData = useMemo(() => {
    return [
      { name: 'Chờ xử lý', value: orderStats?.totalPendingOrders || 0, color: '#f59e0b' },
      { name: 'Thành công', value: orderStats?.totalSuccessOrders || 0, color: '#10b981' },
      { name: 'Thất bại', value: orderStats?.totalFailedOrders || 0, color: '#ef4444' },
    ].filter(item => item.value >= 0);
  }, [orderStats]);

  const totalOrders = useMemo(() => {
    return (orderStats?.totalPendingOrders || 0) + (orderStats?.totalSuccessOrders || 0) + (orderStats?.totalFailedOrders || 0);
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
          Tỷ lệ đơn hàng
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Tỷ lệ phần trăm trạng thái xử lý đơn hàng
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `${value} đơn (${totalOrders > 0 ? ((Number(value) / totalOrders) * 100).toFixed(1) : 0}%)`,
                'Số lượng',
              ]}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
