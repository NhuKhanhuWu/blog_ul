/** @format */

import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../../context/SearchContext";
import { IBlogSimplify } from "../../interface/blog";
import { SearchState } from "../../state/searchReducer";
import BlogCard from "./BlogCard";
import { getBlogs } from "../../api/blog/getBlog";
import Loader from "../Loader";
import Error from "../Error";

function getQuery(state: SearchState) {
  const { title, sort, categories, logic } = state;
  let query = `title=${title}&sort=${sort}&logic=${logic}`;

  if (categories.length !== 0) query += `&categories=${categories}`;

  return query;
}

function BlogList() {
  const { state } = useSearch();
  const query = getQuery(state);
  const {
    data: blogs,
    isPending,
    isError,
  } = useQuery<IBlogSimplify[]>({
    queryKey: ["blogs", query],
    queryFn: () => getBlogs(query),
  });

  if (isPending) return <Loader />;
  if (isError) return <Error />;

  return (
    <div>
      {blogs?.map((blog) => (
        <BlogCard blog={blog} />
      ))}
    </div>
  );
}

export default BlogList;
