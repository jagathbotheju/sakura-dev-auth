"use client";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { Lock, Mail, Phone, User, Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import validator from "validator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    name: z
      .string()
      .min(1, "name is required")
      .min(2, "name must be at least 2 characters")
      .max(45, "name must less than 45 characters"),
    email: z
      .string()
      .min(1, "e-mail is required")
      .email("please enter valid email address"),
    phone: z
      .string()
      .min(1, "phone number is required")
      .refine(validator.isMobilePhone, "please enter valid phone number"),
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
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [passStrength, setPassStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof FormSchema>) => {
    const { accepted, confirmPassword, ...user } = formData;

    startTransition(() => {
      registerUser(user)
        .then((response) => {
          if (response.success) {
            toast.success("User Registered Successfully");
            router.push("/auth/signin");
          }
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          reset();
        });
    });
  };

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch().password]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-2 justify-self-center md:justify-self-start w-full max-w-lg mt-20"
    >
      <Input
        label="Name"
        startContent={<User />}
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
      />
      <Input
        label="E-Mail"
        startContent={<Mail />}
        {...register("email")}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />
      <Input
        label="Phone"
        startContent={<Phone />}
        {...register("phone")}
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
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
      {watch().password?.length && (
        <PasswordStrength passStrength={passStrength} />
      )}

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

      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox onChange={field.onChange} onBlur={field.onBlur}>
            I accept the <Link href="/terms">Terms</Link>
          </Checkbox>
        )}
      />
      {errors.accepted && (
        <p className="text-red-500 text-xs">{errors.accepted.message}</p>
      )}

      <Button
        type="submit"
        className="w-fit"
        color="primary"
        isDisabled={isPending}
      >
        Submit
      </Button>
    </form>
  );
};

export default SignupForm;
