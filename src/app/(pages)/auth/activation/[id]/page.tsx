import { activateUser } from "@/lib/actions/authActions";
import { cn } from "@/lib/cn";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const ActivationPage = async ({ params }: Props) => {
  const result = await activateUser(params.id);
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <p
        className={cn("p-5 rounded-md text-white text-3xl font-bold", {
          "bg-pink-500": !result.success,
          "bg-green-500": result.success,
        })}
      >
        {result.message}
      </p>
      <Button href="/" variant="solid" as={Link}>
        Home
      </Button>
    </div>
  );
};

export default ActivationPage;
