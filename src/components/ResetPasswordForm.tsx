"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { passwordStrength } from "check-password-strength";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { resetPassword } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = ({ id }: Props) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [passStrength, setPassStrength] = useState(0);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "all",
  });

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch().password]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    resetPassword(id, data.password)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          router.push("/auth/signin");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex flex-col mx-auto w-full h-screen justify-center items-center text-center">
      <h1 className="text-3xl font-bold my-5">Reset Your Password</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-2 justify-self-center md:justify-self-start w-full max-w-lg items-center"
      >
        {/* password */}
        <Input
          label="Password"
          startContent={<Lock />}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          {...register("password")}
        />

        {watch().password?.length > 0 && (
          <div className="flex self-start">
            <PasswordStrength passStrength={passStrength} />
          </div>
        )}

        {/* confirm password */}
        <Input
          label="Confirm Password"
          startContent={<Lock />}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-2/3 mt-5"
          color="primary"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
