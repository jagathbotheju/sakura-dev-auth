import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  return (
    <div className="flex w-full mx-auto justify-center mt-10 gap-4">
      <Image
        src={user.image ? user.image : "/blank-profile.png"}
        width={300}
        height={300}
        alt={user.name as string}
      />

      <div className="grid grid-cols-4 items-start h-fit">
        <p>Name</p>
        <p className="col-span-3">{user.name}</p>

        <p>Phone</p>
        <p className="col-span-3">{user.phone}</p>

        <p>Email</p>
        <p className="col-span-3">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
