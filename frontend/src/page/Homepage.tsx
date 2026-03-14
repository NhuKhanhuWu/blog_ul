/** @format */

import BlogList from "../component/Blog/BlogList";
import SearchBar from "../component/Search/SearchBar";
import { SearchProvider } from "../context/SearchContext";
import styles from "../styles/page/Homepage.module.scss";

function Homepage() {
  return (
    <div className={styles.homepageContainer}>
      <SearchProvider>
        <SearchBar></SearchBar>
        <BlogList />
      </SearchProvider>
    </div>
  );
}

export default Homepage;
