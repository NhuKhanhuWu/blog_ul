/** @format */

import BlogList from "../component/Blog/BlogList";
import SearchBarMobile from "../component/Search/Search";
import { SearchProvider } from "../context/SearchContext";

function Homepage() {
  return (
    <SearchProvider>
      <SearchBarMobile></SearchBarMobile>
      <BlogList />
    </SearchProvider>
  );
}

export default Homepage;
