type LineBase =
  | { type: "cmd"; text: string }
  | { type: "out"; text: string }
  | { type: "gap" };

export type Line = LineBase & { delay: number };

export function buildLines(isPt: boolean): Line[] {
  const raw: LineBase[] = isPt
    ? [
        { type: "cmd", text: "> whoami" },
        { type: "out", text: "victor." },
        { type: "gap" },
        { type: "cmd", text: "> ls segredos/" },
        { type: "out", text: "nenhum.  ou quase." },
        { type: "gap" },
        { type: "cmd", text: "> cat .pensamentos" },
        {
          type: "out",
          text: "construir algo do zero ainda é a melhor sensação.",
        },
        { type: "out", text: "código é a única linguagem que não mente." },
        {
          type: "out",
          text: "só porque funciona não quer dizer que está certo.",
        },
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
        {
          type: "out",
          text: "building something from scratch is still the best feeling.",
        },
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

export type HistoryEntry = { input: string; output: string[] };

export function handleCommand(
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
    return isPt ? ["a resposta para tudo."] : ["the answer to everything."];
  }

  if (cmd === "민준" || cmd === "minjun") {
    return [
      "안녕하세요.",
      isPt ? "você realmente foi fundo." : "you really went deep.",
    ];
  }

  if (cmd === "help") {
    return isPt
      ? [
          "não tem help aqui.",
          "tente: ls, pwd, clear, exit, cd ..",
          "ou só explore.",
        ]
      : [
          "no help here.",
          "try: ls, pwd, clear, exit, cd ..",
          "or just explore.",
        ];
  }

  if (cmd.startsWith("sudo")) {
    return isPt
      ? [
          "usuário não está na lista de sudoers.",
          "este incidente será reportado.",
        ]
      : ["user is not in the sudoers file.", "this incident will be reported."];
  }

  if (cmd === "rm -rf /" || cmd === "rm -rf *") {
    return isPt
      ? ["permissão negada.", "(felizmente)"]
      : ["permission denied.", "(fortunately)"];
  }

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
    return isPt ? ["aqui é sempre escuro."] : ["it's always dark here."];
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
      ? [
          "você já tem todos os poderes aqui.",
          "não há nada para fazer com eles.",
        ]
      : [
          "you already have all powers here.",
          "there's nothing to do with them.",
        ];
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
