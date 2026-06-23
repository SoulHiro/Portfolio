import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full h-screen">
      <Button>Um botão clicável</Button>
      <ThemeSwitcher />
    </div>
  );
}
