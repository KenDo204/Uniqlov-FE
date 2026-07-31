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
      className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 bg-white h-full flex flex-col justify-between"
    >
      <Box className="mb-4">
        <Typography className="text-base sm:text-lg font-bold text-gray-900">
          Thống kê đơn hàng
        </Typography>
        <Typography className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Số lượng đơn hàng theo từng trạng thái hệ thống
        </Typography>
      </Box>

      <Box className="w-full h-[240px] sm:h-[280px] lg:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={false}
              formatter={(value: any) => [`${value} đơn hàng`, 'Số lượng']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '13px' }}
            />
            <Bar dataKey="count" name="Số lượng đơn" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => (
                <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
