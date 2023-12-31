import { AccountProfile } from "@/components/forms";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();

  const userInfo = {};

  const userData = {
    id: user?.id || "",
    objectId: userInfo?.objectId || "",
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <main className="mx-auto flex-col flex max-w-3xl justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="bg-dark-2 p-10 mt-9">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default Page;
