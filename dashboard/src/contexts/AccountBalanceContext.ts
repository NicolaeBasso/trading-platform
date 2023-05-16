import React, { Context } from 'react';

const AccountBalanceContext: Context<{ accountBalance: any; setAccountBalance: any }> =
  React.createContext({
    accountBalance: null,
    setAccountBalance: null,
  });

export default AccountBalanceContext;
