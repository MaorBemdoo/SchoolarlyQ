const displayHeaderAndFooter = (pathname: string) => {
  if (pathname == "/auth/register" || pathname == "/auth/login") return false;
  return true;
};

export default displayHeaderAndFooter;
