export const getEndPoint = () => {
  const host = window.location.hostname;
  if (host === "localhost") {
    return "http://" + host + ":5000";
  } else {
    return "https://www.gadhimart.com";
  }
};
