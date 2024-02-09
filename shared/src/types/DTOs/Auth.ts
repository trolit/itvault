export interface IUserSessionDTO {
  id: string;

  userAgent: string;

  issuedAt: string;

  // @TODO req.socket.remoteAddress
}
