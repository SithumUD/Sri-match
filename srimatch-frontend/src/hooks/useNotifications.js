import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// Note: These are placeholders for when the backend implements notifications.
// They mimic the original AuthContext logic.

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Placeholder
      return [];
    },
    enabled: !!isAuthenticated,
    initialData: [],
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // Placeholder API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Placeholder API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useClearNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // Placeholder API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
