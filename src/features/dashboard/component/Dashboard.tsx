import { 
  Box, Grid, CardContent, Typography, List, ListItem, ListItemIcon, 
  ListItemText, Button, CardHeader, useTheme, useMediaQuery, styled
} from '@mui/material';
import { Card } from '../../../components/ui/Cards/Card';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  PointOfSale as TicketsIcon,
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  AssignmentInd as KycIcon,
  PersonAdd as SignupIcon,
  VerifiedUser as KycApprovedIcon,
  Warning as KycRejectedIcon,
  EmojiEvents as WinIcon,
  AddCircleOutline as CreateDrawIcon,
  Payment as PayoutIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Enhanced card styling with scaling
const MinimalCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  transform: 'scale(1)',
  '&:hover': {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px) scale(1.01)'
  },
  [theme.breakpoints.up('lg')]: {
    transform: 'scale(1.02)',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.03)'
    }
  },
  [theme.breakpoints.up('xl')]: {
    transform: 'scale(1.05)',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.06)'
    }
  }
}));

const CompactCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5)
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(2.5)
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(3)
  }
}));

// Mock Data
const kpiData = [
  { title: 'Tickets Sold', value: '42,301', icon: TicketsIcon, color: '#6366F1' },
  { title: 'Revenue', value: '$189,432', icon: RevenueIcon, color: '#10B981' },
  { title: 'Active Users', value: '12,458', icon: UsersIcon, color: '#3B82F6' },
  { title: 'Pending KYC', value: '83', icon: KycIcon, color: '#F59E0B' },
];

const activityData = [
  {
    icon: <SignupIcon color="primary" />,
    title: 'New User',
    description: 'John Doe registered for an account',
    timestamp: '10 min ago'
  },
  {
    icon: <KycApprovedIcon color="success" />,
    title: 'KYC Approved',
    description: 'Jane Smith KYC verified',
    timestamp: '1 hour ago'
  },
  {
    icon: <WinIcon color="warning" />,
    title: 'Big Win!',
    description: 'User #4321 won $250,000 in Powerball',
    timestamp: '2 hours ago'
  },
  {
    icon: <KycRejectedIcon color="error" />,
    title: 'KYC Rejected',
    description: 'Document verification failed for Robert Johnson',
    timestamp: '5 hours ago'
  },
];

const revenueData = [
  { date: 'Jun 1', amount: 12400 },
  { date: 'Jun 5', amount: 30200 },
  { date: 'Jun 10', amount: 18800 },
  { date: 'Jun 15', amount: 27400 },
  { date: 'Jun 20', amount: 31800 },
];

const salesData = [
  { game: 'Powerball', tickets: 12400 },
  { game: 'Mega Millions', tickets: 30200 },
  { game: 'EuroJackpot', tickets: 18800 },
  { game: 'SuperLotto', tickets: 27400 },
];

// Components
const KPICard = ({ title, value, icon: Icon, color = '#6366F1' }: {
  title: string;
  value: string | number;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; };
  color?: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <MinimalCard sx={{ 
      height: '100%',
      transform: isLargeScreen ? 'scale(1.05)' : 'scale(1)',
      '&:hover': {
        transform: isLargeScreen ? 'translateY(-2px) scale(1.07)' : 'translateY(-2px) scale(1.01)'
      }
    }}>
      <CompactCardContent sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        height: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}10`,
          p: isLargeScreen ? 1.75 : 1.5,
          borderRadius: '12px',
          flexShrink: 0
        }}>
          <Icon sx={{ 
            color, 
            fontSize: isMobile ? 24 : isLargeScreen ? 32 : 28 
          }} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500, 
              whiteSpace: 'nowrap',
              fontSize: isLargeScreen ? '0.9rem' : '0.875rem'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            sx={{ 
              fontWeight: 700, 
              lineHeight: 1.2,
              fontSize: isMobile ? '1.1rem' : isLargeScreen ? '1.5rem' : '1.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {value}
          </Typography>
        </Box>
      </CompactCardContent>
    </MinimalCard>
  );
};

const RevenueTrendChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <MinimalCard sx={{ 
      height: '100%',
      transform: isLargeScreen ? 'scale(1.03)' : 'scale(1)',
      '&:hover': {
        transform: isLargeScreen ? 'translateY(-2px) scale(1.05)' : 'translateY(-2px) scale(1.01)'
      }
    }}>
      <CompactCardContent>
        <Typography 
          variant="subtitle1" 
          fontWeight={600} 
          mb={2}
          sx={{ fontSize: isLargeScreen ? '1.15rem' : '1rem' }}
        >
          Revenue Trend (Last 30 Days)
        </Typography>
        <Box sx={{ 
          height: isMobile ? '220px' : isLargeScreen ? '300px' : '260px',
          transition: 'height 0.3s ease'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: isLargeScreen ? 13 : 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000)}k`} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: isLargeScreen ? 13 : 12 }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: isLargeScreen ? '0.9rem' : '0.875rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366F1" 
                strokeWidth={isLargeScreen ? 3 : 2}
                dot={{ r: isLargeScreen ? 5 : 4, fill: '#6366F1', strokeWidth: 2 }}
                activeDot={{ r: isLargeScreen ? 7 : 6, stroke: '#6366F1', strokeWidth: 2, fill: '#FFFFFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CompactCardContent>
    </MinimalCard>
  );
};

const TicketSalesChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <MinimalCard sx={{ 
      height: '100%',
      transform: isLargeScreen ? 'scale(1.03)' : 'scale(1)',
      '&:hover': {
        transform: isLargeScreen ? 'translateY(-2px) scale(1.05)' : 'translateY(-2px) scale(1.01)'
      }
    }}>
      <CompactCardContent>
        <Typography 
          variant="subtitle1" 
          fontWeight={600} 
          mb={2}
          sx={{ fontSize: isLargeScreen ? '1.15rem' : '1rem' }}
        >
          Ticket Sales by Game
        </Typography>
        <Box sx={{ 
          height: isMobile ? '220px' : isLargeScreen ? '300px' : '260px',
          transition: 'height 0.3s ease'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="game" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: isLargeScreen ? 13 : 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: isLargeScreen ? 13 : 12 }}
              />
              <Tooltip 
                formatter={(value) => [value, 'Tickets']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: isLargeScreen ? '0.9rem' : '0.875rem'
                }}
              />
              <Bar 
                dataKey="tickets" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                barSize={isLargeScreen ? 50 : 40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CompactCardContent>
    </MinimalCard>
  );
};

const ActivityItem = ({ icon, title, description, timestamp }: {
  icon: JSX.Element;
  title: string;
  description: string;
  timestamp: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <ListItem 
      alignItems="flex-start" 
      sx={{ 
        py: isLargeScreen ? 1.75 : 1.5,
        px: isMobile ? 1 : isLargeScreen ? 2.5 : 2,
        '&:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      <ListItemIcon sx={{ 
        minWidth: isLargeScreen ? 48 : 40, 
        color: 'inherit',
        '& svg': {
          fontSize: isLargeScreen ? 24 : 20
        }
      }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{ fontSize: isLargeScreen ? '0.95rem' : '0.875rem' }}
            >
              {title}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: isLargeScreen ? '0.75rem' : '0.7rem',
                whiteSpace: 'nowrap'
              }}
            >
              {timestamp}
            </Typography>
          </Box>
        }
        secondary={
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: isLargeScreen ? '0.9rem' : '0.875rem' }}
          >
            {description}
          </Typography>
        }
        sx={{ my: 0 }}
      />
    </ListItem>
  );
};

const QuickActions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <MinimalCard sx={{ 
      height: '100%',
      transform: isLargeScreen ? 'scale(1.05)' : 'scale(1)',
      '&:hover': {
        transform: isLargeScreen ? 'translateY(-2px) scale(1.07)' : 'translateY(-2px) scale(1.01)'
      }
    }}>
      <CardHeader 
        title="Quick Actions" 
        titleTypographyProps={{ 
          variant: 'subtitle1',
          fontWeight: 600,
        }}
        sx={{ 
          pb: 0, 
          px: isMobile ? 1.5 : isLargeScreen ? 2.5 : 2, 
          pt: isMobile ? 1.5 : isLargeScreen ? 2.5 : 2 
        }}
      />
      <CompactCardContent>
        <Grid container spacing={isMobile ? 1 : isLargeScreen ? 2 : 1.5} direction="column">
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size={isMobile ? 'small' : isLargeScreen ? 'large' : 'medium'}
              startIcon={<CreateDrawIcon sx={{ fontSize: isLargeScreen ? 24 : 20 }} />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: isLargeScreen ? '1rem' : '0.875rem',
                py: isLargeScreen ? 1.25 : 1
              }}
            >
              Create Draw
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              color="inherit" 
              fullWidth 
              size={isMobile ? 'small' : isLargeScreen ? 'large' : 'medium'}
              startIcon={<PayoutIcon sx={{ fontSize: isLargeScreen ? 24 : 20 }} />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                fontSize: isLargeScreen ? '1rem' : '0.875rem',
                py: isLargeScreen ? 1.25 : 1
              }}
            >
              View Payout Queue
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              color="inherit" 
              fullWidth 
              size={isMobile ? 'small' : isLargeScreen ? 'large' : 'medium'}
              startIcon={<SearchIcon sx={{ fontSize: isLargeScreen ? 24 : 20 }} />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                fontSize: isLargeScreen ? '1rem' : '0.875rem',
                py: isLargeScreen ? 1.25 : 1
              }}
            >
              Search User
            </Button>
          </Grid>
        </Grid>
      </CompactCardContent>
    </MinimalCard>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <Box sx={{ 
      width: '100%',
      p: isMobile ? 1.5 : isLargeScreen ? 4 : 3,
      maxWidth: '1800px',
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* KPI Cards Row */}
      <Grid 
        container 
        spacing={isMobile ? 1.5 : isLargeScreen ? 3 : 2} 
        sx={{ 
          mb: isMobile ? 2 : isLargeScreen ? 3.5 : 3,
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {kpiData.map((kpi, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: isLargeScreen ? 360 : '100%'
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <KPICard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {/* Charts Row */}
      <Grid 
        container 
        spacing={isMobile ? 1.5 : isLargeScreen ? 3 : 2} 
        sx={{ 
          mb: isMobile ? 2 : isLargeScreen ? 3.5 : 3,
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <Grid 
          item 
          xs={12} 
          lg={6}
          sx={{
            maxWidth: isLargeScreen ? 800 : '100%'
          }}
        >
          <Box sx={{ height: '100%' }}>
            <RevenueTrendChart />
          </Box>
        </Grid>
        <Grid 
          item 
          xs={12} 
          lg={6}
          sx={{
            maxWidth: isLargeScreen ? 800 : '100%'
          }}
        >
          <Box sx={{ height: '100%' }}>
            <TicketSalesChart />
          </Box>
        </Grid>
      </Grid>
      
      {/* Bottom Row - Activity and Quick Actions */}
      <Grid 
        container 
        spacing={isMobile ? 1.5 : isLargeScreen ? 3 : 2} 
        sx={{ 
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <Grid 
          item 
          xs={12} 
          lg={8}
          sx={{
            maxWidth: isLargeScreen ? 1000 : '100%'
          }}
        >
          <Box sx={{ height: '100%' }}>
            <MinimalCard sx={{ height: '100%' }}>
              <CardHeader 
                title="Recent Activity" 
                titleTypographyProps={{ 
                  variant: 'subtitle1',
                  fontWeight: 600,
                }}
                sx={{ 
                  pb: 0, 
                  px: isMobile ? 1.5 : isLargeScreen ? 2.5 : 2, 
                  pt: isMobile ? 1.5 : isLargeScreen ? 2.5 : 2 
                }}
              />
              <List disablePadding>
                {activityData.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    timestamp={activity.timestamp}
                  />
                ))}
              </List>
            </MinimalCard>
          </Box>
        </Grid>
        <Grid 
          item 
          xs={12} 
          lg={4}
          sx={{
            maxWidth: isLargeScreen ? 500 : '100%'
          }}
        >
          <Box sx={{ height: '100%' }}>
            <QuickActions />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;