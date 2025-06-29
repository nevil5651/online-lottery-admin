import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './features/dashboard/component/Dashboard';
import CreateDrawPage from './pages/CreateDrawPage';
import UsersPage from './pages/UsersPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { DrawList } from './features/drawManagement';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdminManagement } from './features/admin-management/AdminManagement';
import { AuthProvider } from './auth/AuthContext';
import FinanceDashboard from './features/finance/FinanceDashboard';


function App() {

  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/createdraw" element={<CreateDrawPage />} />
                  <Route path="/managedraws" element={<DrawList />} />
                  <Route path="/manageadmin" element={<AdminManagement />} />
                  <Route path="/financedashboard" element={<FinanceDashboard />} />
                </Route>
              </Routes>
              </AuthProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;