import { Grid, Button } from '@mantine/core';
import { logoutIcon } from '../assets/icons/logout';
import { useNavigate } from 'react-router-dom';

export const TopNavBar = ({ setUser }) => {
  const navigate = useNavigate();

  return (
    <Grid
      h={100}
      justify='space-between'
      style={{
        backgroundColor: 'white',
        alignContent: 'center',
        color: '#228be6',
      }}
    >
      <Grid.Col span={3}>Overmind Trading</Grid.Col>
      <Grid.Col span={5}>
        <Grid>
          <Grid.Col span={3}>
            <p>Available</p>
            <p>Available</p>
          </Grid.Col>
          <Grid.Col span={2}>
            <p>Equity</p>
            <p>Equity</p>
          </Grid.Col>
          <Grid.Col span={2}>
            <p>Funds</p>
            <p>Funds</p>
          </Grid.Col>
          <Grid.Col span={2}>
            <p>P&L</p>
            <p>P&L</p>
          </Grid.Col>
          <Grid.Col
            span={3}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onClick={() => {
              navigate('/login');
              setUser(null);
              localStorage.clear();
            }}
          >
            <Button
              style={{
                backgroundColor: '#228be6',
                width: '-webkit-fill-available',
                height: '-webkit-fill-available',
              }}
            >
              <p>Logout</p>
              <div
                style={{
                  display: 'flex',
                  alignContent: 'center',
                  alignItems: 'center',
                  width: '25px',
                  height: '25px',
                }}
              >
                {logoutIcon}
              </div>
            </Button>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};
