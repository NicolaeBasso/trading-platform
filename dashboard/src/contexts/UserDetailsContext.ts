import React, { Context } from 'react';

const UserDetailsContext: Context<{ userDetails: any; setUserDetails: any }> = React.createContext({
  userDetails: null,
  setUserDetails: null,
});

export default UserDetailsContext;
