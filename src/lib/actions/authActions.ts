"use server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import {
  compileActivationMailTemplate,
  compileForgotPasswordMailTemplate,
  sendMail,
} from "../mail";
import { user } from "@nextui-org/react";
import { signJwt, verifyJwt } from "../jwt";

//REGISTER USER
export const registerUser = async ({
  name,
  email,
  password,
  phone,
}: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  try {
    if (!email || !name || !phone || !password) {
      throw Error("Error Creating User,Missing Fields");
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (exist) {
      throw Error("Email Address Already Exist");
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        hashedPassword: hashedPw,
      },
    });
    if (!newUser) {
      throw Error("Unable to create user, please try later");
    }

    const { hashedPassword, ...userNoPass } = newUser;

    //send activation mail
    const jwtUserId = signJwt({ id: userNoPass.id });
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
    const body = compileActivationMailTemplate(
      newUser.name || "guest",
      activationUrl
    );
    await sendMail({
      to: userNoPass.email as string,
      subject: "Activate Your Account",
      body,
    });

    return {
      success: true,
      data: userNoPass,
    };
  } catch (error: any) {
    throw Error("Internal Server Error");
  }
};

//ACTIVATE USER
export const activateUser = async (jwtUserId: string) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User Not Exist",
    };
  }
  if (user.emailVerified) {
    return {
      success: false,
      message: "User Already Verified",
    };
  }

  //update emailVerified
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return {
    success: true,
    message: "User Verified Successfully",
  };
};

//FORGOT PASSWORD LINK
export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new Error("User does not Exist");

    //send email with password re-set link
    const jwtUserId = signJwt({
      id: user.id,
    });
    const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${jwtUserId}`;
    const body = compileForgotPasswordMailTemplate(user.name!, resetPassUrl);
    const sendResult = await sendMail({
      to: user.email as string,
      subject: "Reset Password Request",
      body,
    });

    return {
      success: true,
      message: "Email has been sent to re-set password",
    };
  } catch (error) {
    console.log(error);
    throw Error("Internal Server Error");
  }
};

//REST PASSWORD
export const resetPassword = async (id: string, password: string) => {
  const payload = verifyJwt(id);
  if (!payload) throw new Error("Could not reset password, no user found.");

  const userId = payload.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) throw new Error("Could not reset password, no user found.");

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword: await bcrypt.hash(password, 10),
    },
  });

  if (!result) throw new Error("Something went wrong");

  return {
    success: true,
    message: "Password reset Successfully",
  };
};
