import SignupForm from "@/components/SignupForm";
import { Image, Link } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";

const SignupPage = () => {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-5 text-center">Sing Up</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
        <div className="justify-self-center md:justify-self-end">
          <Image src="/login.png" alt="login image" width={400} height={400} />
        </div>
        <SignupForm />
        <div className="md:col-span-2 flex justify-center items-center">
          <Link href="/auth/signin">
            Already have an Account? Sign-In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
