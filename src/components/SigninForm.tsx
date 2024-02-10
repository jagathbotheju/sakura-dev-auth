"use client";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { Lock, Mail, Phone, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, useTransition } from "react";
import { z } from "zod";
import validator from "validator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "e-mail is required")
    .email("please enter valid email address"),
  password: z
    .string()
    .min(1, "password is required")
    .min(6, "password must be at least 6 characters")
    .max(20, "password cannot exceed 20 characters"),
});

const SigninForm = ({ callbackUrl }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof FormSchema>) => {
    const { email, password } = formData;
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("You are logged in");
        reset();
        router.push(callbackUrl ? callbackUrl : "/");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-2 justify-self-center md:justify-self-start w-full max-w-lg items-center"
    >
      <Input
        label="E-Mail"
        startContent={<Mail />}
        {...register("email")}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />

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

      <Button
        type="submit"
        className="w-2/3 mt-5"
        color="primary"
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
      <div className="flex flex-col justify-center items-center mt-5">
        <Link className="text-sm" href="/auth/signup">
          {"Don't have an Account? Sign-Up"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link className="text-sm" href="/auth/forgot-password">
          Forgot your Password?
        </Link>
      </div>
    </form>
  );
};

export default SigninForm;
