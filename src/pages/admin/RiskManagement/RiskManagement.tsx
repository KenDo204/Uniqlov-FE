import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControlLabel,
  Switch, Select, MenuItem, FormControl, InputLabel, CircularProgress, Tooltip, IconButton
} from '@mui/material';
import { Edit, WarningAmber, CheckCircle, Shield, Assessment, TaskAlt } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useRisk } from '@/hooks/useRisk';
import type { RiskRuleResponse, RiskAlertResponse } from '@/types/risk';
import { RiskAlertStatus } from '@/types/risk';
import { formatDate } from '@/utils/dateUtils';
import CustomPagination from '@/components/general/Pagination';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const RiskManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý rủi ro</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Cấu hình các quy tắc và xử lý các cảnh báo rủi ro trong hệ thống</p>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="risk management tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-theme)',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#6b7280',
                '&.Mui-selected': {
                  color: 'var(--color-theme)',
                },
              },
            }}
          >
            <Tab icon={<Shield fontSize="small" />} iconPosition="start" label="Cấu hình Rule" />
            <Tab icon={<Assessment fontSize="small" />} iconPosition="start" label="Cảnh báo Rủi ro" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <RuleConfigurationsTab />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <RiskAlertsTab />
        </CustomTabPanel>
      </div>
    </div>
  );
};

const RuleConfigurationsTab: React.FC = () => {
  const { rules, isFetchingRules, fetchRules, updateRule, clearError, error } = useRisk();
  const [editRule, setEditRule] = useState<RiskRuleResponse | null>(null);
  const [threshold, setThreshold] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleEditClick = (rule: RiskRuleResponse) => {
    setEditRule(rule);
    setThreshold(String(rule.thresholdValue));
    setTimeWindow(String(rule.timeWindowMinutes || 0));
    setIsActive(rule.isActive);
  };

  const handleCloseEdit = () => {
    if (!isUpdating) {
      setEditRule(null);
    }
  };

  const handleSaveEdit = async () => {
    if (editRule) {
      setIsUpdating(true);
      try {
        await updateRule(editRule.ruleCode, {
          thresholdValue: Number(threshold) || 0,
          timeWindowMinutes: Number(timeWindow) || 0,
          isActive: isActive,
        });
        toast.success('Cập nhật Rule thành công');
        handleCloseEdit();
      } catch (err) {
        // error is handled by slice and useEffect
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Mã Rule</th>
                <th className="px-6 py-4 font-semibold">Tên Rule</th>
                <th className="px-6 py-4 font-semibold text-center w-32 text-nowrap">Mức Rủi ro</th>
                <th className="px-6 py-4 font-semibold text-center text-nowrap">Ngưỡng</th>
                <th className="px-6 py-4 font-semibold text-center text-nowrap">Thời gian (phút)</th>
                <th className="px-6 py-4 font-semibold text-center w-32 text-nowrap">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-center text-nowrap">Ngày cập nhật</th>
                <th className="px-6 py-4 font-semibold text-center w-32 text-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isFetchingRules ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <CircularProgress size={32} sx={{ color: 'var(--color-theme)' }} />
                    <p className="mt-2 text-gray-500 m-0">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule.ruleCode} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-gray-900">{rule.ruleCode}</td>
                    <td className="px-6 py-4">{rule.ruleName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskLevelBadge(rule.riskLevel)}`}>
                        {rule.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-blue-600">{rule.thresholdValue}</td>
                    <td className="px-6 py-4 text-center">{rule.timeWindowMinutes || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border ${
                        rule.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">{formatDate(rule.updatedAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip title="Chỉnh sửa rule" arrow>
                          <IconButton
                            onClick={() => handleEditClick(rule)}
                            size="small"
                            sx={{ color: 'var(--color-theme)', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                      <p className="text-gray-500 font-medium m-0">Không có dữ liệu Rule</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog 
        open={!!editRule} 
        onClose={handleCloseEdit} 
        maxWidth="sm" 
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <Shield sx={{ fontSize: 48, color: 'var(--color-theme)' }} />
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
            Cập nhật Rule: {editRule?.ruleCode}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-5 mt-2 p-2">
            <TextField
              label="Ngưỡng (Threshold)"
              type="number"
              fullWidth
              variant="outlined"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              disabled={isUpdating}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Khung Thời gian (phút)"
              type="number"
              fullWidth
              variant="outlined"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              disabled={isUpdating}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)} 
                  disabled={isUpdating}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-theme)' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--color-theme)' },
                  }}
                />
              }
              label="Kích hoạt (Active)"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button 
            onClick={handleCloseEdit} 
            variant="outlined"
            disabled={isUpdating}
            sx={{
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '10px',
              '&:hover': {
                borderColor: "#9ca3af",
                bgcolor: "#f9fafb"
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            disabled={isUpdating}
            sx={{
              backgroundColor: 'var(--color-theme)', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '10px', boxShadow: 'none',
              '&:hover': { backgroundColor: 'var(--color-theme-hover)', boxShadow: 'none' }
            }}
          >
            {isUpdating ? <CircularProgress size={20} color="inherit" /> : 'Lưu cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const RiskAlertsTab: React.FC = () => {
  const { alerts, isFetchingAlerts, fetchAlerts, resolveAlert, clearError, error } = useRisk();
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [resolveAlertData, setResolveAlertData] = useState<RiskAlertResponse | null>(null);
  const [resolveStatus, setResolveStatus] = useState<RiskAlertStatus>(RiskAlertStatus.RESOLVED);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    fetchAlerts({ page: page - 1, size, status: statusFilter || undefined });
  }, [fetchAlerts, page, size, statusFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResolveClick = (alert: RiskAlertResponse) => {
    setResolveAlertData(alert);
    setResolveStatus(RiskAlertStatus.RESOLVED);
  };

  const handleCloseResolve = () => {
    if (!isResolving) {
      setResolveAlertData(null);
    }
  };

  const handleSaveResolve = async () => {
    if (resolveAlertData) {
      setIsResolving(true);
      try {
        await resolveAlert(resolveAlertData.alertId, { status: resolveStatus });
        toast.success('Xử lý cảnh báo thành công');
        handleCloseResolve();
      } catch (err) {
        // handled by slice
      } finally {
        setIsResolving(false);
      }
    }
  };

  const getAlertStatusBadge = (status: RiskAlertStatus) => {
    switch (status) {
      case RiskAlertStatus.PENDING: return 'bg-amber-50 text-amber-700 border-amber-100';
      case RiskAlertStatus.RESOLVED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case RiskAlertStatus.FALSE_POSITIVE: return 'bg-gray-50 text-gray-500 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="w-64">
          <FormControl fullWidth size="small" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
            <InputLabel>Bộ lọc trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Bộ lọc trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              <MenuItem value={RiskAlertStatus.PENDING}>Đang chờ (Pending)</MenuItem>
              <MenuItem value={RiskAlertStatus.RESOLVED}>Đã xử lý (Resolved)</MenuItem>
              <MenuItem value={RiskAlertStatus.FALSE_POSITIVE}>Báo cáo sai (False Positive)</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-20 text-center">ID</th>
                <th className="px-6 py-4 font-semibold">Rule</th>
                <th className="px-6 py-4 font-semibold">Người dùng</th>
                <th className="px-6 py-4 font-semibold">Đơn hàng</th>
                <th className="px-6 py-4 font-semibold">Mô tả</th>
                <th className="px-6 py-4 font-semibold text-center w-36">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-center text-nowrap">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold text-center w-32 text-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isFetchingAlerts && (!alerts || alerts.content.length === 0) ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <CircularProgress size={32} sx={{ color: 'var(--color-theme)' }} />
                    <p className="mt-2 text-gray-500 m-0">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : alerts?.content && alerts.content.length > 0 ? (
                alerts.content.map((alert) => (
                  <tr key={alert.alertId} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 text-center font-medium">#{alert.alertId}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{alert.ruleCode}</td>
                    <td className="px-6 py-4">{alert.userEmail || alert.userId || '-'}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{alert.orderCode || alert.orderId || '-'}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={alert.description}>{alert.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border ${getAlertStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">{formatDate(alert.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      {alert.status === RiskAlertStatus.PENDING ? (
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip title="Xử lý cảnh báo" arrow>
                            <IconButton
                              onClick={() => handleResolveClick(alert)}
                              size="small"
                              sx={{ color: 'var(--color-theme)', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                            >
                              <TaskAlt fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip title="Đã xử lý" arrow>
                            <IconButton
                              disabled
                              size="small"
                              sx={{ color: '#9ca3af' }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                      <p className="text-gray-500 font-medium m-0">Không có dữ liệu cảnh báo</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {alerts && alerts.totalPages > 0 && (
          <CustomPagination
            currentPage={page}
            totalPages={alerts.totalPages}
            totalItems={alerts.totalElements}
            itemsPerPage={size}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Dialog 
        open={!!resolveAlertData} 
        onClose={handleCloseResolve} 
        maxWidth="xs" 
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <WarningAmber sx={{ fontSize: 48, color: '#f59e0b' }} />
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
            Xử lý Cảnh báo #{resolveAlertData?.alertId}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box className="mt-4 p-2">
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Vui lòng chọn quyết định xử lý cho cảnh báo vi phạm <strong>{resolveAlertData?.ruleCode}</strong>.
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
              <InputLabel>Quyết định</InputLabel>
              <Select
                value={resolveStatus}
                label="Quyết định"
                onChange={(e) => setResolveStatus(e.target.value)}
                disabled={isResolving}
              >
                <MenuItem value="RESOLVED">Resolved (Thật sự rủi ro)</MenuItem>
                <MenuItem value="FALSE_POSITIVE">False Positive (Báo cáo sai)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button 
            onClick={handleCloseResolve} 
            variant="outlined"
            disabled={isResolving}
            sx={{
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '10px',
              '&:hover': {
                borderColor: "#9ca3af",
                bgcolor: "#f9fafb"
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveResolve} 
            variant="contained"
            disabled={isResolving}
            sx={{
              backgroundColor: 'var(--color-theme)', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '10px', boxShadow: 'none',
              '&:hover': { backgroundColor: 'var(--color-theme-hover)', boxShadow: 'none' }
            }}
          >
            {isResolving ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RiskManagement;
