import SigninForm from "@/components/SigninForm";
import { Image, Link } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const SigninPage = ({ searchParams }: Props) => {
  return (
    <div>
      <h1 className="font-bold text-3xl my-10 text-center">Sing In</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-start gap-4">
        <div className="justify-self-center md:justify-self-end">
          <Image src="/login.png" alt="login image" width={400} height={400} />
        </div>
        <SigninForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
};

export default SigninPage;
