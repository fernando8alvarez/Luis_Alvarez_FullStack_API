export interface VerificationEmail {
  to: string;
  message: {
    subject: string;
    html: string;
  };
  attachments: any[];
}

export interface ResetPasswordEmail {
  to: string;
  message: {
    subject: string;
    html: string;
  };
  attachments: any[];
}
