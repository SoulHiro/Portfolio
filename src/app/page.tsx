import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full h-screen">
      <h1 className="text-3xl font-display">
        Victor <br />
        <span className="text-neutral-400 italic">M.</span> Santos
      </h1>
      <Button>Um botão clicável</Button>
      <ThemeSwitcher />
    </div>
  );
}
