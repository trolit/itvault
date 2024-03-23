export const silentlyUpdateUrl = (options: {
  pathname?: string;
  searchParams?: URLSearchParams;
}) => {
  const {
    location: { origin, pathname },
  } = window;

  if (options.pathname && !options.pathname.startsWith("/")) {
    options.pathname = `/${options.pathname}`;
  }

  let url = `${origin}${options?.pathname || pathname}`;

  if (options.searchParams && options.searchParams.size) {
    url += `?${options.searchParams.toString()}`;
  }

  history.pushState({}, "", url);
};
