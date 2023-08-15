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

export const fetchPosts = async (pageNumber = 1, pagesize = 20) => {
  connectToDb();
  const skipAmount = (pageNumber - 1) * pagesize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pagesize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
};

export const fetchThreadById = async (id: string) => {
  connectToDb();

  try {
    // todo: pupulate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate([
        {
          path: "children",
          model: User,
          select: "_id id name parentId image",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
        },
      ])
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error("Fail while fetching the thread", error.message);
  }
};
