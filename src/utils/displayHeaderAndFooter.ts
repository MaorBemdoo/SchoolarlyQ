const displayHeaderAndFooter = (pathname: string) => {
  if (pathname == "/auth/register" || pathname == "/auth/login" || (pathname.startsWith("/exams") && pathname.endsWith("/quiz"))) return false;
  return true;
};

export default displayHeaderAndFooter;
