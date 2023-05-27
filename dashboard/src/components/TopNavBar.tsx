import { Grid, Button } from '@mantine/core';
import { logoutIcon } from '../assets/icons/logout';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AccountBalanceContext from '../contexts/AccountBalanceContext';

export const TopNavBar = ({ setUser }) => {
  const navigate = useNavigate();

  const { accountBalance } = useContext(AccountBalanceContext);
  const { funds, equity, available, margin, profit } = accountBalance.live;

  return (
    <Grid
      h={100}
      justify='space-between'
      style={{
        backgroundColor: 'rgba(202, 214, 250, 0.1)',
        opacity: '1 !important',
        alignContent: 'center',
        color: '#228be6',
        padding: '2rem',
      }}
    >
      <Grid.Col
        span={3}
        style={{ display: 'flex', alignItems: 'center', fontSize: 'larger', fontWeight: 'bold' }}
      >
        Overmind Trading
      </Grid.Col>
      <Grid.Col span={8}>
        <Grid>
          <Grid.Col span={2} style={{ color: funds >= 0 ? '#228be6' : '#de2e21' }}>
            <p>Funds</p>
            <p>{funds?.toFixed(2) || '-'}</p>
          </Grid.Col>
          <Grid.Col span={2} style={{ color: equity >= 0 ? '#228be6' : '#de2e21' }}>
            <p>Equity</p>
            <p>{equity?.toFixed(2) || '-'}</p>
          </Grid.Col>
          <Grid.Col span={2} style={{ color: available >= 0 ? '#228be6' : '#de2e21' }}>
            <p>Available</p>
            <p>{available?.toFixed(2) || '-'}</p>
          </Grid.Col>
          <Grid.Col span={2} style={{ color: margin >= 0 ? '#228be6' : '#de2e21' }}>
            <p>Margin</p>
            <p>{margin?.toFixed(2) || '-'}</p>
          </Grid.Col>
          <Grid.Col span={2} style={{ color: profit >= 0 ? '#228be6' : '#de2e21' }}>
            <p>P&L</p>
            <p>{profit?.toFixed(2) || '-'}</p>
          </Grid.Col>
          <Grid.Col
            span={2}
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
