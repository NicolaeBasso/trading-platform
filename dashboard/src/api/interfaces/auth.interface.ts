interface LoginInterface {
  email: string;
  password: string;
}

interface ForgotPasswordInterface {
  email: string;
}

interface ResetPasswordInterface {
  email: string | null;
  password: string;
  confirmedPassword: string;
  resetToken: string | null;
}

export type { LoginInterface, ForgotPasswordInterface, ResetPasswordInterface };
