"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

/* ─── Static lines ─── */

type LineBase =
  | { type: "cmd"; text: string }
  | { type: "out"; text: string }
  | { type: "gap" };

type Line = LineBase & { delay: number };

function buildLines(isPt: boolean): Line[] {
  const raw: LineBase[] = isPt
    ? [
        { type: "cmd", text: "> whoami" },
        { type: "out", text: "victor." },
        { type: "gap" },
        { type: "cmd", text: "> ls segredos/" },
        { type: "out", text: "nenhum.  ou quase." },
        { type: "gap" },
        { type: "cmd", text: "> cat .pensamentos" },
        { type: "out", text: "construir algo do zero ainda é a melhor sensação." },
        { type: "out", text: "código é a única linguagem que não mente." },
        { type: "out", text: "só porque funciona não quer dizer que está certo." },
        { type: "gap" },
      ]
    : [
        { type: "cmd", text: "> whoami" },
        { type: "out", text: "victor." },
        { type: "gap" },
        { type: "cmd", text: "> ls secrets/" },
        { type: "out", text: "none.  or almost." },
        { type: "gap" },
        { type: "cmd", text: "> cat .thoughts" },
        { type: "out", text: "building something from scratch is still the best feeling." },
        { type: "out", text: "code is the only language that doesn't lie." },
        { type: "out", text: "just because it works doesn't mean it's right." },
        { type: "gap" },
      ];

  let acc = 0;
  return raw.map((item) => {
    const delay = acc;
    if (item.type === "gap") acc += 0.15;
    else if (item.type === "cmd") acc += 0.5;
    else acc += 0.38;
    return { ...item, delay } as Line;
  });
}

/* ─── Command handler ─── */

type HistoryEntry = { input: string; output: string[] };

function handleCommand(
  raw: string,
  isPt: boolean,
  onExit: () => void,
  onClear: () => void,
): string[] {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "cd .." || cmd === "exit" || cmd === "quit") {
    onExit();
    return [];
  }

  if (cmd === "clear") {
    onClear();
    return [];
  }

  if (cmd === "pwd") return ["/void"];

  if (cmd === "ls" || cmd === "ls -la") return [".   .."];

  if (cmd === "whoami") return ["victor."];

  if (cmd === "42") {
    return isPt
      ? ["a resposta para tudo."]
      : ["the answer to everything."];
  }

  if (cmd === "민준" || cmd === "minjun") {
    return ["안녕하세요.", isPt ? "você realmente foi fundo." : "you really went deep."];
  }

  if (cmd === "help") {
    return isPt
      ? ["não tem help aqui.", "tente: ls, pwd, clear, exit, cd ..", "ou só explore."]
      : ["no help here.", "try: ls, pwd, clear, exit, cd ..", "or just explore."];
  }

  if (cmd.startsWith("sudo")) {
    return isPt
      ? ["usuário não está na lista de sudoers.", "este incidente será reportado."]
      : ["user is not in the sudoers file.", "this incident will be reported."];
  }

  if (cmd === "rm -rf /" || cmd === "rm -rf *") {
    return isPt
      ? ["permissão negada.", "(felizmente)"]
      : ["permission denied.", "(fortunately)"];
  }

  /* ─── Minecraft ─── */

  const mc = cmd.startsWith("/") ? cmd.slice(1) : cmd;

  if (mc === "gamemode creative" || mc === "gamemode 1") {
    return isPt
      ? ["modo criativo ativado.", "o vazio já era assim de qualquer jeito."]
      : ["creative mode enabled.", "the void was already like this anyway."];
  }

  if (mc === "gamemode survival" || mc === "gamemode 0") {
    return isPt
      ? ["modo survival ativado.", "boa sorte sobrevivendo aqui."]
      : ["survival mode enabled.", "good luck surviving here."];
  }

  if (mc === "kill" || mc === "kill @s") {
    return isPt
      ? ["você morreu.", "pontuação: 0", "— renascer aqui não é uma opção."]
      : ["you died.", "score: 0", "— respawning here is not an option."];
  }

  if (mc.startsWith("tp") || mc.startsWith("teleport")) {
    return isPt
      ? ["não é possível teleportar do vazio.", "destino não encontrado."]
      : ["cannot teleport from the void.", "destination not found."];
  }

  if (mc.startsWith("give")) {
    return isPt
      ? ["não há inventário aqui.", "e o que você faria com isso?"]
      : ["there is no inventory here.", "and what would you even do with it?"];
  }

  if (mc.startsWith("summon")) {
    const mob = mc.split(" ")[1] ?? "entity";
    return isPt
      ? [`${mob} invocado.`, "ele também está confuso."]
      : [`${mob} summoned.`, "it's also confused."];
  }

  if (mc === "time set day" || mc === "time set 1000") {
    return isPt
      ? ["aqui é sempre escuro."]
      : ["it's always dark here."];
  }

  if (mc === "time set night" || mc === "time set 13000") {
    return isPt
      ? ["já era noite.", "bem-vindo ao clube."]
      : ["it was already night.", "welcome to the club."];
  }

  if (mc.startsWith("weather")) {
    return isPt
      ? ["o vazio não tem clima.", "só tem silêncio."]
      : ["the void has no weather.", "just silence."];
  }

  if (mc.startsWith("enchant")) {
    return isPt
      ? ["encantamento aplicado: confusão I."]
      : ["enchantment applied: confusion I."];
  }

  if (mc === "op" || mc.startsWith("op ")) {
    return isPt
      ? ["você já tem todos os poderes aqui.", "não há nada para fazer com eles."]
      : ["you already have all powers here.", "there's nothing to do with them."];
  }

  if (mc === "difficulty peaceful") {
    return isPt
      ? ["não existe peaceful no vazio."]
      : ["there is no peaceful in the void."];
  }

  if (mc.startsWith("say ")) {
    const msg = mc.slice(4);
    return [`[victor] ${msg}`];
  }

  if (cmd === "") return [];

  return isPt
    ? [`bash: ${raw.trim()}: comando não encontrado`]
    : [`bash: ${raw.trim()}: command not found`];
}

/* ─── Page ─── */

export default function VoidPage() {
  const locale = useLocale();
  const router = useRouter();
  const isPt = locale === "pt-br";
  const lines = buildLines(isPt);

  const totalDelay = lines[lines.length - 1].delay + 0.4;

  const [inputReady, setInputReady] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setInputReady(true);
    }, totalDelay * 1000 + 400);
    return () => clearTimeout(t);
  }, [totalDelay]);

  useEffect(() => {
    if (inputReady) inputRef.current?.focus();
  }, [inputReady]);

  const submit = useCallback(() => {
    const raw = inputValue;
    setInputValue("");

    const output = handleCommand(
      raw,
      isPt,
      () => router.push("/"),
      () => setHistory([]),
    );

    if (raw.trim() !== "" || output.length > 0) {
      setHistory((prev) => [...prev, { input: raw, output }]);
    }
  }, [inputValue, isPt, router]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Pulsing ambient background */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.18 0 0) 0%, oklch(0.04 0 0) 100%)",
        }}
      />

      <div className="relative z-10 font-mono text-sm leading-loose max-w-lg w-full px-8">
        {/* Static animated lines */}
        {lines.map((line, i) => {
          if (line.type === "gap") return <div key={i} className="h-3" />;
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: line.delay, duration: 0.3 }}
              className={
                line.type === "cmd" ? "text-[#e5e5e5]" : "text-[#52525b] pl-4"
              }
            >
              {line.text}
            </motion.p>
          );
        })}

        {/* Command history */}
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[#e5e5e5]">&gt; {entry.input}</p>
              {entry.output.map((line, j) => (
                <p key={j} className="text-[#52525b] pl-4">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interactive prompt */}
        <AnimatePresence>
          {inputReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center text-[#e5e5e5]"
            >
              <span className="select-none">&gt;&nbsp;</span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] font-mono text-sm caret-[#e5e5e5]"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              {inputValue === "" && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                  className="text-[#e5e5e5] select-none pointer-events-none"
                >
                  _
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
