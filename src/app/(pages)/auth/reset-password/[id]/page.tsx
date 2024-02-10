import ResetPasswordForm from "@/components/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";

interface Props {
  params: {
    id: string;
  };
}

const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJwt(params.id);

  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        Link is not valid, please try again.
      </div>
    );
  }

  return (
    <div>
      <ResetPasswordForm id={params.id} />
    </div>
  );
};

export default ResetPasswordPage;
