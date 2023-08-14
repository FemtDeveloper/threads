"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";
import { UserInfo } from "@/interfaces/user";

interface Params {
  username: string;
  name: string;
  bio: string;
  image: string;
  userId: string;
  path: string;
}

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> => {
  connectToDb();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), bio, name, image, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failing creating / updating user: ${error.message}`);
  }
};

export const fetchUser = async (userId: string): Promise<UserInfo | null> => {
  try {
    connectToDb();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error("Fail fetching the user: " + error.message);
  }
};
