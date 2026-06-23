import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Button variant="outline">Um botão clicável</Button>
      <ThemeSwitcher />
    </div>
  );
}
