/** @format */
import BlogListForm from "../BlogListForm/BlogListForm";
import { useQuery } from "@tanstack/react-query";
import { getListMetaData } from "../../../api/blog-list.api";
import { ReactNode, useState } from "react";

interface EditBlogListBtnProps {
  btnContent: ReactNode;
  listId: string;
}

function EditBlogListBtn({ listId, btnContent }: EditBlogListBtnProps) {
  const [isEdit, setIsEdit] = useState(false);
  const { data } = useQuery({
    queryKey: ["blog-list-infor", listId],
    queryFn: () => getListMetaData(listId),
    enabled: isEdit,
  });

  return (
    <>
      <button onClick={() => setIsEdit(true)}>{btnContent}</button>

      {/* edit form */}
      {data && (
        <BlogListForm
          isOpening={isEdit}
          isUpdating={true}
          blogList={data}
          setIsOpening={setIsEdit}></BlogListForm>
      )}
    </>
  );
}

export default EditBlogListBtn;
