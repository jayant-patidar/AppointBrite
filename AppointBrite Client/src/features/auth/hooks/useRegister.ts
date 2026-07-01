/**
 * useRegister — mutation hook for user registration.
 */
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth.api';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/config/routes';

export function useRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
      }));
      navigate(ROUTES.HOME);
    },
  });
}
