import { PostThread } from "@/components/forms";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import React from "react";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return;

  const userInfoJson = JSON.parse(JSON.stringify(userInfo));

  return (
    <>
      <h1 className="head-text text-left">Create thread</h1>;
      <PostThread userId={userInfoJson._id as string} />
    </>
  );
};

export default Page;
