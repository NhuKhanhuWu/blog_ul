/** @format */

import BlogList from "../component/Blog/BlogList";
import SearchBar from "../component/Search/SearchBar";
import { SearchProvider } from "../context/SearchContext";
import "../styles/page/Homepage.scss";

function Homepage() {
  return (
    <div className="homepage-container">
      <SearchProvider>
        <SearchBar></SearchBar>

        {/* <BlogList /> */}

        <div className="test">
          {Array.from({ length: 1000 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              deleniti repellat ea eum, inventore est nostrum facilis veritatis
              totam ut dignissimos! Libero iusto minima ducimus itaque cumque
              quae commodi nobis.
            </p>
          ))}
        </div>
      </SearchProvider>
    </div>
  );
}

export default Homepage;
