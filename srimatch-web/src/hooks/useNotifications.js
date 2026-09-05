import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/notification.service';

export const useNotifications = (page = 0, size = 30) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['notifications', page, size],
    queryFn: async () => {
      const response = await NotificationService.getNotifications({ page, size });
      // Return list of notifications (if paginated Page object, return content or data)
      if (response && response.data) {
        return response.data.content || response.data || [];
      }
      return [];
    },
    enabled: !!isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 45, // Poll every 45s as a fallback
  });
};

export const useUnreadNotificationCount = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await NotificationService.getUnreadCount();
      if (response && response.data && typeof response.data.unreadCount === 'number') {
        return response.data.unreadCount;
      }
      return 0;
    },
    enabled: !!isAuthenticated,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => NotificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Optimistically update notifications list
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((n) => (n.id === id ? { ...n, read: true } : n));
      });

      // Optimistically decrement unread count
      queryClient.setQueryData(['notifications', 'unread-count'], (old) => {
        return typeof old === 'number' && old > 0 ? old - 1 : 0;
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((n) => ({ ...n, read: true }));
      });

      queryClient.setQueryData(['notifications', 'unread-count'], 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useClearNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => NotificationService.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((n) => n.id !== id);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
