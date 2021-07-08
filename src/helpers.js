import { useState, useEffect } from "react";
import { PROD } from "./constants";

const HOST = PROD ? "" : "http://localhost:3000";

export const useFetch = (url) => {
  const [response, setResponse] = useState({});
  useEffect(async () => {
    const res = await fetch(
      HOST + url,

      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    const json = await res.json();
    setResponse({ ...response, ...json });
  }, []);
  return response;
};

export default useFetch;
