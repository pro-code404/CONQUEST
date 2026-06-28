export interface ActiveSessionView {
  sessionId: string;
  deviceId: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface ProfileSummaryView {
  displayName: string;
  email: string;
  orgName: string;
  role: string;
}
