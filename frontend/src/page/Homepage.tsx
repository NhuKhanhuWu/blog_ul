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
        <BlogList />
      </SearchProvider>
    </div>
  );
}

export default Homepage;
