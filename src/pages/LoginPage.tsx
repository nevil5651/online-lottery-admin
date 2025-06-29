// src/pages/LoginPage.tsx
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../components/ui/Buttons/Button';
import { Card, CardBody } from '../components/ui/Cards/Card';
import { TextField } from '../components/ui/TextField';
import { Link } from '../components/ui/Link';

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<FormData>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Card sx={{ 
        width: '100%',
        maxWidth: { xs: '95%', sm: 480 },
        transform: 'translateY(-5%)',
      }}>
        <CardBody>
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              fontWeight: 600,
              mb: 3,
              color: 'text.primary'
            }}
          >
            Admin Portal
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Secure access to your workspace
          </Typography>

          <Box 
            component="form" 
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 3 }}
            />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    color="primary"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
              />

              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              loading={isLoading}
              sx={{ mt: 4 }}
            >
              Continue
            </Button>

            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 3,
                color: 'text.secondary'
              }}
            >
              Don't have access?{' '}
              <Link 
                component={RouterLink} 
                to="/request-access" 
                sx={{ fontWeight: 500 }}
              >
                Request account
              </Link>
            </Typography>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default LoginPage;