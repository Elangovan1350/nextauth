import SignUpForm from "@/app/components/SignUpForm";
import { Button, Image, Link } from "@nextui-org/react";

const Signup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center items-center gap-3">
      <div className="md:col-span-2 flex justify-center items-center p-2">
        <p className="pr-1">Already Signed Up? </p>
        <Link href={"/auth/signin"}>Sign In</Link>
      </div>
      <SignUpForm />
      <Image src="/login.png" alt="login form" width={500} height={500} />
    </div>
  );
};

export default Signup;
