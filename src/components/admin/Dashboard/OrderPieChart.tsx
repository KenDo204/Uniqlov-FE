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
      className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 bg-white h-full flex flex-col justify-between"
    >
      <Box className="mb-4">
        <Typography className="text-base sm:text-lg font-bold text-gray-900">
          Tỷ lệ đơn hàng
        </Typography>
        <Typography className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Tỷ lệ phần trăm trạng thái xử lý đơn hàng
        </Typography>
      </Box>

      <Box className="w-full h-[240px] sm:h-[280px] lg:h-[320px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="75%"
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
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '13px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
