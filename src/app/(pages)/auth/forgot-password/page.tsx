"use client";
import { forgotPassword } from "@/lib/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please provide valid email address"),
});

const ForgotPasswordPage = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(() => {
      forgotPassword(data.email)
        .then((response) => {
          if (response.success) {
            toast.success(response.message);
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

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <Image
          src="/forgotPass.png"
          alt="forgot password"
          width={400}
          height={400}
          className="col-span-2 justify-self-center"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-2"
        >
          <Input
            label="Email"
            {...register("email")}
            startContent={<Mail />}
            errorMessage={errors.email?.message}
          />
          <Button
            isLoading={isSubmitting}
            isDisabled={isPending}
            color="primary"
            type="submit"
          >
            {isSubmitting ? "Please wait..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
