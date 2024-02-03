const DOMAIN = "itvault.dev";

export const roleNameToEmail = (name: string) =>
  `${name.toLowerCase().replace(/ /g, ".")}@${DOMAIN}`;
