export interface IUserSessionDTO {
  userId: string;

  userAgent: string;

  issuedAt: string;

  sessionId: string;

  // @TODO req.socket.remoteAddress
}
