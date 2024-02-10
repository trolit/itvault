export interface IUserSessionDTO {
  userAgent: string;

  issuedAt: string;

  sessionId: string;

  isRequesterSession: boolean;

  // @TODO req.socket.remoteAddress
}
