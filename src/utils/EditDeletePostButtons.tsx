import React from "react";
// import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  // const [{ data: meData }] = useMeQuery();
  // const [, deletePost] = useDeletePostMutation();

  // if (meData?.me?.id !== creatorId) {
  //   return null;
  // }

  return null;

  // return (
  //   <Box>
  //     <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
  //       <IconButton
  //         icon="edit"
  //         mr={4}
  //         aria-label="Update Post"
  //         onClick={() => {}}
  //       />
  //     </NextLink>
  //     <IconButton
  //       icon="delete"
  //       aria-label="Delete Post"
  //       onClick={() => {
  //         deletePost({
  //           id,
  //         });
  //       }}
  //     />
  //   </Box>
  // );
};

export default EditDeletePostButtons;
