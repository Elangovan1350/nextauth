import { cn } from "clsx-tailwind-merge";

interface Props {
  passStreagth: number;
}
const PasswordStreagth = ({ passStreagth }: Props) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: passStreagth + 1 }).map((i, index) => (
        <div
          key={index}
          className={cn("h-2 w-32 rounded-md", {
            "bg-red-500": passStreagth === 0,
            "bg-orange-500": passStreagth === 1,
            "bg-yellow-500": passStreagth === 2,
            "bg-green-500": passStreagth === 3,
          })}
        ></div>
      ))}
    </div>
  );
};

export default PasswordStreagth;
