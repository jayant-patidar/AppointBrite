/**
 * useLogin — mutation hook for user login.
 */
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth.api';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/config/routes';

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
      }));
      navigate(ROUTES.HOME);
    },
  });
}
