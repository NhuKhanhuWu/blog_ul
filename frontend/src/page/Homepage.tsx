/** @format */

import SearchBarMobile from "../component/Search/Search";
import { SearchProvider } from "../context/SearchContext";

function Homepage() {
  return (
    <SearchProvider>
      <SearchBarMobile></SearchBarMobile>
    </SearchProvider>
  );
}

export default Homepage;
