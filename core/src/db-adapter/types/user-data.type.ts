export type UserDataType = {
  settings: {
    licenseType: string;
    theme: string;
  };
  session: Record<string, any>;
};
