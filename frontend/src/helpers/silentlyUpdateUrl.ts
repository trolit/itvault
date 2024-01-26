export const silentlyUpdateUrl = (options: {
  pathname?: string;
  searchParams?: URLSearchParams;
}) => {
  const {
    location: { origin, pathname },
  } = window;

  let url = [origin, options?.pathname || pathname].join("/");

  if (options.searchParams) {
    url += `?${options.searchParams.toString()}`;
  }

  history.pushState({}, "", url);
};
