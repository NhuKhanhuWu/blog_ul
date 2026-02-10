/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [blog, setBlog] = useState(123);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/v1/blogs");

      setBlog(response.data);
    }
    fetchData();
  }, []);

  console.log(blog);

  return <>TEST CALL API</>;
}

export default App;
