// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (err: any, fallback: string = 'An error occurred.') => {
  const { response } = err;
  if (response) {
    const { data } = response;
    if (typeof data == 'string') {
      return data;
    }
    return data.message;
  }
  return err.message || fallback;
};
