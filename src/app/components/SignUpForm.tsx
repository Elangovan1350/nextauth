"use client";

import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStreagth from "./PasswordStreagth";
import { registerUser } from "@/lib/action/authAction";
import { toast } from "react-toastify";

const formSchama = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name Must Have 2 Characters")
      .max(45, "Last Name Not Exied 45 Characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No speacal character allowed"),

    lastName: z
      .string()
      .min(2, "Last Name Must Have 2 Characters")
      .max(45, "Last Name Not Exied 45 Characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No speacal character allowed"),
    email: z.string().email("Please Enter Valid Email Adress"),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please Enter Valid Mobile Number"),
    password: z
      .string()
      .min(6, "Password Must Be 6 Characters")
      .max(50, "Password Must be Less Then 50 Charaters"),
    conformPassword: z
      .string()
      .min(6, "Password Must Be 6 Characters")
      .max(50, "Password Must be Less Then 50 Charaters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please  accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: "Password And Conform Password doesn't match! ",
    path: ["conformPassword"],
  });

type InputType = z.infer<typeof formSchama>;

const SignUpForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchama),
  });
  const [passStrength, setPassStrength] = useState(0);
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    console.log(passwordStrength(watch().password).value);
  }, [watch().password]);

  const toggleVisiblePassword = () => setIsVisiblePassword((pre) => !pre);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { accepted, conformPassword, ...user } = data;
    try {
      const result = await registerUser(user);
      toast.success("The User Register SuccessFully");
    } catch (error) {
      toast.error("somthing went roung");
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className="grid grid-cols-2 gap-3 mx-5 place-self-stretch"
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        {...register("firstName")}
        label="First Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        {...register("lastName")}
        label="Last Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        {...register("email")}
        label="Email"
        className="col-span-2"
        startContent={<EnvelopeIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        {...register("phone")}
        label="Phone Number"
        className="col-span-2"
        startContent={<PhoneIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        {...register("password")}
        label="Password"
        className="col-span-2"
        type={isVisiblePassword ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisiblePassword ? (
            <EyeSlashIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePassword}
            />
          ) : (
            <EyeIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePassword}
            />
          )
        }
      />
      <PasswordStreagth passStreagth={passStrength} />
      <Input
        errorMessage={errors.conformPassword?.message}
        isInvalid={!!errors.conformPassword}
        {...register("conformPassword")}
        label="Conform Password"
        className="col-span-2"
        type={isVisiblePassword ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
      />
      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className="col-span-2"
          >
            I Accept The <Link href="/terms">Terms</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}

      <div className="flex justify-center col-span-2">
        <Button color="primary" className="w-1/2" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
