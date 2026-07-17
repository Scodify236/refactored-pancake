export interface OtpState {
  code: string;
  expiresAt: number;
}

export interface SessionState {
  email: string;
  expiresAt: number;
}

// Global in-memory storage, persistent per server life cycle
declare global {
  var currentOtp: OtpState | null;
  var sessions: Map<string, SessionState>;
}

if (!global.sessions) {
  global.sessions = new Map<string, SessionState>();
}
if (!global.currentOtp) {
  global.currentOtp = null;
}

export const authStore = {
  getOtp: () => global.currentOtp,
  setOtp: (otp: OtpState | null) => {
    global.currentOtp = otp;
  },
  getSessions: () => global.sessions,
};
