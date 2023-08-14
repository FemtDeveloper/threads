"use server";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: Params) => {
  connectToDb();

  const createdThread = await Thread.create({ text, author, community: null });

  // update user modek

  await User.findOneAndUpdate(
    { id: author },
    {
      $push: { threads: createdThread._id },
    }
  );
};
