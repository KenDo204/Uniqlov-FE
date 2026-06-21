  import React from "react";
  import {
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
  } from "@mui/material";
  import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
  import CircleIcon from "@mui/icons-material/Circle";
  import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
  import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
  import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
  import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
  import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
  import type { NotificationItem as NotificationItemType } from "@/types/notificationTypes";

  // Map notification type to icon & color
  const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    ORDER: {
      icon: <ShoppingCartOutlinedIcon fontSize="small" />,
      color: "#1976d2",
      label: "Đơn hàng",
    },
    PROMOTION: {
      icon: <LocalOfferOutlinedIcon fontSize="small" />,
      color: "#e65100",
      label: "Khuyến mãi",
    },
    SYSTEM: {
      icon: <InfoOutlinedIcon fontSize="small" />,
      color: "#00927c",
      label: "Hệ thống",
    },
    ANNOUNCEMENT: {
      icon: <CampaignOutlinedIcon fontSize="small" />,
      color: "#7b1fa2",
      label: "Thông báo",
    },
  };

  const getTypeConfig = (type: string) => {
    return (
      typeConfig[type] || {
        icon: <NotificationsNoneIcon fontSize="small" />,
        color: "#757575",
        label: type,
      }
    );
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  interface NotificationItemProps {
    notification: NotificationItemType;
    onMarkAsRead: (id: number) => void;
    onClick?: (notification: NotificationItemType) => void;
  }

  const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onClick,
  }) => {
    const config = getTypeConfig(notification.type);

    return (
      <Box
        onClick={() => onClick?.(notification)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: notification.is_read ? "transparent" : "rgba(0, 146, 124, 0.04)",
          borderLeft: notification.is_read ? "3px solid transparent" : `3px solid ${config.color}`,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {/* Type Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${config.color}15`,
            color: config.color,
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          {config.icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: notification.is_read ? 500 : 700,
                color: notification.is_read ? "text.secondary" : "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {notification.title}
            </Typography>
            {!notification.is_read && (
              <CircleIcon sx={{ fontSize: 8, color: config.color, flexShrink: 0 }} />
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notification.content}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={config.label}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                bgcolor: `${config.color}15`,
                color: config.color,
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" color="text.disabled">
              {formatRelativeTime(notification.created_at)}
            </Typography>
          </Box>
        </Box>

        {/* Mark as read button */}
        {!notification.is_read && (
          <Tooltip title="Đánh dấu đã đọc" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              sx={{
                color: "text.disabled",
                flexShrink: 0,
                "&:hover": {
                  color: "#00927c",
                  bgcolor: "rgba(0, 146, 124, 0.08)",
                },
              }}
            >
              <MarkEmailReadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  export default NotificationItem;