export interface IUserSessionDTO {
  userId: string;

  userAgent: string;

  issuedAt: string;

  sessionId: string;

  isRequesterSession: boolean;

  // @TODO req.socket.remoteAddress
}
