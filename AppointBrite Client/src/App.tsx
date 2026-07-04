/**
 * App.tsx — Root component with all providers and routing.
 */
import { useMemo, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store, type RootState } from '@/store';
import { queryClient } from '@/api/queryClient';
import { lightTheme, darkTheme } from '@/styles/theme';
import { ROUTES } from '@/config/routes';
import { authApi } from '@/api/auth';
import { setUser, setLoading } from '@/store/slices/authSlice';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import LoadingScreen from '@/components/shared/LoadingScreen';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import ScrollToTop from '@/components/shared/ScrollToTop';
import CustomerLayout from '@/components/layout/CustomerLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Lazy-loaded pages (code splitting)
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'));
const BusinessProfilePage = lazy(() => import('@/features/business/pages/BusinessProfilePage'));
const BookingWizardPage = lazy(() => import('@/features/booking/pages/BookingWizardPage'));
const BookingConfirmationPage = lazy(() => import('@/features/booking/pages/BookingConfirmationPage'));
const CustomerDashboardPage = lazy(() => import('@/features/customer/pages/CustomerDashboardPage'));
const MyBookingsPage = lazy(() => import('@/features/customer/pages/MyBookingsPage'));
const FavoritesPage = lazy(() => import('@/features/customer/pages/FavoritesPage'));
const ProfilePage = lazy(() => import('@/features/customer/pages/ProfilePage'));
const DashboardOverviewPage = lazy(() => import('@/features/dashboard/pages/DashboardOverviewPage'));
const CalendarPage = lazy(() => import('@/features/dashboard/pages/CalendarPage'));
const BookingManagementPage = lazy(() => import('@/features/dashboard/pages/BookingManagementPage'));
const ServiceManagementPage = lazy(() => import('@/features/dashboard/pages/ServiceManagementPage'));
const StaffManagementPage = lazy(() => import('@/features/dashboard/pages/StaffManagementPage'));
const CustomerCRMPage = lazy(() => import('@/features/dashboard/pages/CustomerCRMPage'));
const AnalyticsPage = lazy(() => import('@/features/dashboard/pages/AnalyticsPage'));
const BusinessProfileEditPage = lazy(() => import('@/features/dashboard/pages/BusinessProfileEditPage'));
const PromotionsPage = lazy(() => import('@/features/dashboard/pages/PromotionsPage'));
const OnboardingWizardPage = lazy(() => import('@/features/dashboard/pages/OnboardingWizardPage'));
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('@/features/admin/pages/UserManagementPage'));
const BusinessVerificationPage = lazy(() => import('@/features/admin/pages/BusinessVerificationPage'));
const ContentModerationPage = lazy(() => import('@/features/admin/pages/ContentModerationPage'));
const PlatformAnalyticsPage = lazy(() => import('@/features/admin/pages/PlatformAnalyticsPage'));
const CategoryManagementPage = lazy(() => import('@/features/admin/pages/CategoryManagementPage'));

function AppRoutes() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const dispatch = useDispatch();
  const theme = useMemo(
    () => (themeMode === 'dark' ? darkTheme : lightTheme),
    [themeMode],
  );

  useEffect(() => {
    authApi.me()
      .then((user) => dispatch(setUser(user)))
      .catch(() => { /* silent fail, user is not logged in */ })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    document.title = 'AppointBrite - Book Appointments & Reservations';
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = themeMode === 'dark' ? '/dark them logo.png' : '/light theme logo.png';
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

            {/* ── Customer Portal (public + auth) ── */}
            <Route element={<CustomerLayout />}>
              <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SEARCH} replace />} />
              <Route path={ROUTES.SEARCH} element={<SearchPage />} />
              <Route path={ROUTES.BUSINESS_PROFILE} element={<BusinessProfilePage />} />

              {/* Guest/Customer Accessible Booking Flow */}
              <Route path={ROUTES.BOOKING_WIZARD} element={<BookingWizardPage />} />
              <Route path={ROUTES.BOOKING_CONFIRMATION} element={<BookingConfirmationPage />} />

              {/* Protected customer routes */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'BUSINESS_OWNER', 'STAFF', 'SUPER_ADMIN']} />}>
                <Route path={ROUTES.CUSTOMER.DASHBOARD} element={<CustomerDashboardPage />} />
                <Route path={ROUTES.CUSTOMER.BOOKINGS} element={<MyBookingsPage />} />
                <Route path={ROUTES.CUSTOMER.FAVORITES} element={<FavoritesPage />} />
                <Route path={ROUTES.CUSTOMER.PROFILE} element={<ProfilePage />} />
              </Route>
            </Route>

            {/* ── Business Dashboard ── */}
            <Route element={<ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'STAFF']} />}>
              <Route path={ROUTES.DASHBOARD.ONBOARDING} element={<OnboardingWizardPage />} />
              <Route element={<DashboardLayout />}>
                <Route path={ROUTES.DASHBOARD.ROOT} element={<Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />} />
                <Route path={ROUTES.DASHBOARD.OVERVIEW} element={<DashboardOverviewPage />} />
                <Route path={ROUTES.DASHBOARD.CALENDAR} element={<CalendarPage />} />
                <Route path={ROUTES.DASHBOARD.BOOKINGS} element={<BookingManagementPage />} />
                <Route path={ROUTES.DASHBOARD.SERVICES} element={<ServiceManagementPage />} />
                <Route path={ROUTES.DASHBOARD.STAFF} element={<StaffManagementPage />} />
                <Route path={ROUTES.DASHBOARD.CUSTOMERS} element={<CustomerCRMPage />} />
                <Route path={ROUTES.DASHBOARD.ANALYTICS} element={<AnalyticsPage />} />
                <Route path={ROUTES.DASHBOARD.PROFILE} element={<BusinessProfileEditPage />} />
                <Route path={ROUTES.DASHBOARD.PROMOTIONS} element={<PromotionsPage />} />
              </Route>
            </Route>

            {/* ── Super Admin Portal ── */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN.ROOT} element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
                <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN.USERS} element={<UserManagementPage />} />
                <Route path={ROUTES.ADMIN.BUSINESSES} element={<BusinessVerificationPage />} />
                <Route path={ROUTES.ADMIN.MODERATION} element={<ContentModerationPage />} />
                <Route path={ROUTES.ADMIN.ANALYTICS} element={<PlatformAnalyticsPage />} />
                <Route path={ROUTES.ADMIN.CATEGORIES} element={<CategoryManagementPage />} />
              </Route>
            </Route>

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
