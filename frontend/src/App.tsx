/** @format */

import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [blog, setBlog] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/v1/blogs");

      setBlog(response.data);
    }
    fetchData();
  }, []);

  return <>{blog}</>;
}

export default App;
