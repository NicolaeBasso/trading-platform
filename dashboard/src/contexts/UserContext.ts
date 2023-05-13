import React, { Context } from 'react';

const UserContext: Context<{ user: { profile: any; trade: any } | any; setUser: any }> =
  React.createContext({
    user: null,
    setUser: null,
  });

export default UserContext;
