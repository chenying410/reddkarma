// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'


const UserListCards = ({ usersWithSubscriptions }) => {

  const totalUsers = usersWithSubscriptions.length;
  const subscribedUsers = usersWithSubscriptions.filter(user => user.subscriptions.some(sub => sub.status === 'active')).length;
  const activeUsers = usersWithSubscriptions.filter(user => user.subscriptions.some(sub => sub.status === 'active' && new Date(sub.endDate) > new Date())).length;
  const expiredUsers = usersWithSubscriptions.filter(user => user.subscriptions.some(sub => sub.status === 'expired')).length;

  const data = [
    {
      title: 'Session',
      stats: totalUsers.toLocaleString(),
      avatarIcon: 'tabler-users',
      avatarColor: 'primary',
      subtitle: 'Total User'
    },
    {
      title: 'Subscribed Users',
      stats: subscribedUsers.toLocaleString(),
      avatarIcon: 'tabler-user-plus',
      avatarColor: 'error',
      subtitle: 'Last week analytics'
    },
    {
      title: 'Active Users',
      stats: activeUsers.toLocaleString(),
      avatarIcon: 'tabler-user-check',
      avatarColor: 'success',
      subtitle: 'Last week analytics'
    },
    {
      title: 'Expired Users',
      stats: expiredUsers.toLocaleString(),
      avatarIcon: 'tabler-user-search',
      avatarColor: 'warning',
      subtitle: 'Last week analytics'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
