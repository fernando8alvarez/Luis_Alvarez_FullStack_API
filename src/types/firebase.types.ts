export interface FirebaseEmailData {
  to: string;
  message: {
    subject: string;
    html: string;
    attachments?: any[];
  };
  attachments?: any[];
}
