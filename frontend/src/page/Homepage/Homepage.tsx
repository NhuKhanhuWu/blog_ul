/** @format */

import Blogs from "../../component/blog/Blogs/Blogs";
import SearchBar from "../../component/search/SearchBar/SearchBar";
import { SearchProvider } from "../../context/SearchContext";
import styles from "./Homepage.module.scss";

function Homepage() {
  return (
    <div className={styles.homepageContainer}>
      <SearchProvider>
        <SearchBar></SearchBar>
        <Blogs />
      </SearchProvider>
    </div>
  );
}

export default Homepage;
