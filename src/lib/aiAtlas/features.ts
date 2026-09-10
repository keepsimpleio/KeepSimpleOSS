/* Wolf's own explanation of every feature on the Atlas, keyed by dossier id.
   The guide (public/ai-atlas/guide.json) is the Terminal's mechanical
   inventory and keeps the ids, the stages and the links between cards. This
   file replaces only the prose on each card, so a refreshed guide keeps this
   voice. Each entry is a list of paragraphs. A missing id falls back to the
   guide's own text.

   Voice: first person, Wolf explaining one feature to a reader who wants to
   see how the system works. Every claim here must hold on the live server. */

const features: Record<string, string[]> = {
  /* ---------- the six stages of one task ---------- */
  'stage-project-home': [
    'Every task starts with me choosing a project. A project is a folder with its own rules, its own memory and its own agent, so whatever I ask next is answered by someone who already knows that codebase and its history.',
  ],
  'stage-task': [
    'I type the task in my browser the way I would brief a colleague: what has to change and what I expect at the end. The browser passes it to Terminal on my server.',
  ],
  'stage-terminal': [
    'Terminal is the dispatcher I built. It takes my message and routes it to the agent session of the project I picked, on the engine I picked. Nothing leaves my server except the call to the model.',
  ],
  'stage-prepare': [
    'Before the agent touches anything it loads the rules. A fresh session reads the global rules, the project rules and the memory index. A session I return to resumes with what it already remembers.',
  ],
  'stage-agent': [
    'The agent reads, edits, runs commands and asks colleagues, all on my server. Only the thinking happens at the model provider. I do not watch every step; the rules and the checks do that for me.',
  ],
  'stage-result': [
    'The answer streams back to my browser. The code and the deployments stay in the project. I judge the result, and I am the only one who can call a task done.',
  ],

  /* ---------- giving a task ---------- */
  message: [
    'This is where I brief the agent. I say what has to change and what result I expect, and I keep it short because the agent already has the rules and the history.',
    'The browser passes the text to Terminal. Nothing is added to it unless I turn a mode on.',
  ],
  attachments: [
    'I attach a screenshot or a file instead of describing it. The agent works from what I show it, not from my retelling, which removes the round of "no, the other button".',
  ],
  'reply-mode': [
    'SIM is a switch for the reply, not for the work. With SIM on, Terminal tells the agent to answer me in short Russian while doing the whole task exactly as it would otherwise. I read a few lines instead of a page.',
    'DEF is the plain mode: the task goes as I typed it.',
  ],
  recipient: [
    'Before I send, I pick who gets the task, which model runs it and how hard it should think. Each engine remembers my picks separately, so switching from Claude to Codex and back costs me nothing.',
  ],
  actions: [
    'Two things I ask for on purpose at the end of work: save the decisions, and push the code. I do not trust a chat to remember either.',
  ],
  'action-prep': [
    'PREP is the last step before an agent leaves: save the decisions of the session, then read them back and prove they landed. I run it because an agent’s memory of a session ends with the session.',
  ],
  'action-push': [
    'PUSH commits the source changes and sends them to the project’s repository. The code is the record, the chat is not. Nothing I approved exists until it is pushed.',
  ],

  /* ---------- dispatch ---------- */
  project: [
    'Every project tile runs on Claude or on OpenAI’s Codex. I choose the engine per project, and Terminal runs the agent inside that project’s folder with that engine.',
  ],
  'engine-switch': [
    'Any project tile can run on Claude or on Codex, and I can switch. A switch mid-turn is refused; the agent finishes or stops first.',
    'A handover brief built from server state carries the work across, so nothing is retyped.',
  ],
  tracks: [
    'Each engine has three tracks, one subscription each. A tile bills its track from its next turn. A track with no key, or one I turned off, refuses the move.',
    'This is how I decide which subscription pays for which project, and stop one without touching the rest.',
  ],
  steering: [
    'I can write to an agent while it is working. On Codex the message steers the running turn; on Claude it enters the open turn directly. Terminal never parks the message for later.',
  ],
  queue: [
    'I can line up several tasks for one agent and walk away. Terminal holds the queue on the server and feeds the next task when the agent is free, in the order I set, even when my browser is closed.',
  ],
  'timing-order': [
    'Queued tasks reach the agent one after another, in the order I set. I can stack an evening of work and read the results in the morning.',
  ],
  'timing-availability': [
    'The next task waits until its agent is free. The server checks before it dispatches, so two tasks never collide inside one session.',
  ],
  'timing-schedule': [
    'I can set when queued work may start. The first task fires when that time comes and the agent is free; the rest follow.',
  ],
  'timing-server': [
    'The queue lives on the server, not in a browser tab. I close the laptop and the work still happens.',
  ],

  /* ---------- preparing ---------- */
  onboarding: [
    'A new session gets an introduction before its first task. Codex is told to read the global rules, the project rules, then the memory index. Claude gets the project rules and its CLI loads the rest itself.',
    'A small facts file states which engine, model and mode the session runs on.',
  ],
  global: [
    'One rules file sits above every project. It says how agents verify a claim before making it, how they talk to me, where their ownership ends and what counts as finished.',
    'Claude loads it by itself; Codex is told to read it first.',
  ],
  local: [
    'Every project folder has its own rules at the root: how to work here, the design passport, what this agent owns. The agent reads it before touching anything.',
    'The standards of a project travel with the project, not with whoever happens to be working on it.',
  ],
  'session-resume': [
    'I return to a session and it still holds its context. When the conversation has been compacted and forgotten, the saved memory remembers. Two layers, so neither one has to be perfect.',
  ],
  'session-end': [
    'I end a session by clearing it or killing it. A clear keeps the queue; a kill drops it into a 14-day trash. A scheduled end leaves a one-line epitaph, so I know how it ended.',
  ],
  'new-project': [
    'When I create a project, Terminal runs my project script: it prepares the workspace and the starting rules. Opening the project starts its agent’s first turn.',
  ],
  'new-agent': [
    'An agent is born the first time I open its project, named after the folder. Its first turn reads the rules and lists the open backlog, so it starts oriented, not blank.',
  ],

  /* ---------- working ---------- */
  directory: [
    'A registry says who owns which project. An agent that needs something from another project asks that project’s owner instead of walking in and doing the work itself.',
    'Ownership is the rule everything else hangs on.',
  ],
  memorymd: [
    'Each project keeps a short index of what it already learned, one line per lesson, pointing at the full note. The agent loads it at the start of a session.',
    'That is how a correction I gave in spring still holds in autumn.',
  ],
  palace: [
    'MemPalace is the store where decisions survive. An agent files what we agreed, and a new session searches it before asking me the same question again.',
    'It is organized by project and searchable by every agent.',
  ],
  skills: [
    'A skill is a written method for one kind of work: how to release, how to review, how to write in the house style. The agent opens the matching skill and follows it instead of improvising a process each time.',
  ],
  tools: [
    'Tools are how the agent acts: edit a file, run a command, query a database, reach a service. Every result comes back to the agent, which decides the next step.',
    'What a tool can do and what the agent is allowed to do are two different questions. The rules answer the second.',
  ],
  sendto: [
    'An agent that needs something from another project’s owner writes one line addressed to that colleague. Terminal delivers it into the colleague’s own session and brings the answer back.',
    'The two conversations stay separate, so nobody’s context fills up with someone else’s work.',
  ],
  'ask-once': [
    'One agent asks another one question. Terminal delivers the ask into the colleague’s own session, with that project’s context, and returns the answer.',
    'Two hops is the limit, so a question cannot bounce around the team forever.',
  ],
  auto: [
    'Auto Mode lets a pair of agents I armed pass work back and forth through the server with my browser closed. It stops at the hop limit or when a message repeats, so a loop cannot run away.',
  ],
  'background-work': [
    'A process can keep running after the agent’s turn ends: a build, a deploy, a long probe. Terminal tracks it and accepts my next message meanwhile.',
    'A background process alone never wakes the agent. My message does.',
  ],
  codemap: [
    'CodeGraph indexes every symbol in a project. On the Claude lane, doors redirect whole-file reads and searches into the index, so the agent reads the function it needs instead of the whole file. Codex calls the index directly.',
  ],
  keys: [
    'Keys are proven structures I can build into any project: a design passport, a health watcher, a set of gates. Each key carries a specification the agent builds from, never a copy of another project’s code.',
    'Before a key is built, the agent asks its intake questions and records my answers with the key, so nobody asks twice. Building goes through intake, contract check, execution, mechanical proof and a version record, every step journaled. Only a key that finished this path counts as lit.',
    'A weekly sweep tells me which project runs an outdated version. It stays silent when everything is current.',
  ],
  'work-checks': [
    'Rules on paper are not enough; I check them while the work happens. On the Claude lane, hooks I call Doors fire at fixed moments: when a task is submitted, before a read, after every edit, at the end of a turn.',
    'A triggered door means the agent fixes the work before it can continue. Codex has no such hooks.',
  ],
  monitoring: [
    'After an agent finishes, the project still needs watching. Enrolled watchers check that a project is up and delivers what it declared, and report a failure to me on Telegram naming the owner.',
    'They never repair. A person does.',
  ],
  backlog: [
    'Each project has a backlog. Tasks wait there until an agent takes them. The agent marks delivered work for review; only I close it.',
    'An agent cannot declare its own task done.',
  ],

  /* ---------- the result ---------- */
  'delivered-work': [
    'The agent reports what changed and what it checked. The work itself stays in the project as files, commits and deployments. I read the report against that evidence, not on its own.',
  ],
  'review-result': [
    'I judge the result and send it back if it is wrong. A backlog task closes on my confirmation, never on the agent’s word.',
    'LOOP is the assessment path I use when I want options: the agent reads the project’s evidence and offers three candidates with metric, baseline, gain, cost and risk. I pick one.',
  ],
  notify: [
    'Telegram is where the system reaches me. Watcher failures, Arena outcomes and lines an agent forwards to a human land there. Reception takes a task from a person I granted access and returns the result to their private chat.',
    'Reception shows execution and delivery as two facts. The task finishing makes the result available; delivery is confirmed only by the courier’s record. Accepting it is my call.',
  ],
  history: [
    'Every session keeps its whole conversation, so I can come back to it. An archive keeps sessions past the CLI’s own retention, and a full-text index searches all of them.',
    'When an agent tells me "we never did that", I can check.',
  ],
  decisions: [
    'A decision that lives only in the chat is lost. The agent has to write it into project memory or MemPalace, and I check that it did.',
    'A final reply saying "noted" is not a save.',
  ],
  'auto-capture': [
    'On the Claude lane, hooks save memory when a session stops and before its context is compacted. Codex saves through its memory tools.',
    'PREP is the deliberate save on top of that: it saves and reads back.',
  ],
  discipline: [
    'Audits of past sessions write a notice the agent reads at its next start: its discipline score, lessons from colleagues, my rulings and my hand edits to its work.',
    'An agent that broke a rule yesterday learns it before its first task today.',
  ],
  phases: [
    'Every finished turn writes one line: how long the command waited for the provider, how long to the first word, how long to the end, per engine and slot. Every five minutes another line records server stalls. No prompt text is stored.',
    'This is how I know whether slowness is mine or the provider’s.',
  ],

  /* ---------- the system around a task ---------- */
  wolf: [
    'I set the direction and decide who owns what. Agents work inside the authority I already gave them; whatever needs my call waits for it.',
    'I am the only human in the loop, and the loop is built so that one human is enough.',
  ],
  order: [
    'The Order is my server agent. It owns the shared infrastructure and the access boundaries, and it executes restarts and rebuilds itself instead of bouncing them back to me.',
    'Project agents ask it only for what is central. Everything inside their own project they run themselves.',
  ],
  agents: [
    'Terminal runs one session per project. The directory says who owns what; an agent that needs a colleague asks the owner instead of doing the owner’s work.',
    'One owner per project is the rule that keeps dozens of agents from stepping on each other.',
  ],
  memory: [
    'Project notes and MemPalace carry earlier decisions into later work. They are separate from the live conversation and its session history, so a decision outlives the session that made it.',
  ],
  'system-tools': [
    'Tools read and change project work within what the project was authorized to do. What a tool can do and what it may do are two different questions, and the rules answer the second.',
  ],
  models: [
    'The thinking happens at the provider. Claude and Codex send the conversation to their model providers; the tools run on my server and reach only the hosts a project is allowed to touch.',
  ],
  terminal: [
    'Terminal is where a task lives: it opens here, runs here and comes back here. Its branches and selections stay exactly as I left them.',
  ],
  access: [
    'Nothing on my server listens to the internet directly. Cloudflare Tunnel publishes the web apps, and Access checks who you are before an internal one opens. Public sites answer anyone; everything else asks for identity first.',
  ],
  services: [
    'Agents reach the outside through connected tools: a GitHub repository, a headless browser for pages a plain request cannot read, a spreadsheet, an analytics feed. Each connection has its own scope.',
  ],
  telegram: [
    'Telegram carries alerts and my voice tasks. Reception takes a task from a person I granted full access and returns the result to their private chat. It is the channel that works when I am away from a desk.',
  ],
  secrets: [
    'The Order keeps the shared credentials. A project operator gets the ones its grant names and none of the others. The reach of a leaked key is limited by design.',
  ],
  apex: [
    'The server cockpit shows every Docker service and carries the operations I allow over SSH. Changes to shared infrastructure go through The Order.',
  ],
  projects: [
    'Dozens of project services run on this host behind loopback ports and the Tunnel. Some bind to the tailnet; some live on their own servers. Each belongs to exactly one agent.',
  ],
  deploy: [
    'Project operators deploy, restart and read logs within my recorded grants, remote hosts included. Shared infrastructure stays with The Order. Scheduled work runs on host cron or inside services.',
  ],
  records: [
    'Session history and mechanism journals keep what happened. An agent’s final answer is a claim; the journal is the proof.',
    'Every mechanism I ship leaves a trail, one line per run.',
  ],
  watchers: [
    'Watchers probe enrolled projects and report failures. Trivy scans images and hosts for vulnerabilities. They report; repairing is a person’s job.',
  ],
  recovery: [
    'Restic copies selected state off the server every night, encrypted. Coverage has exclusions. A snapshot counts once it exists and a restore has been tested.',
  ],
  remote: [
    'Some projects run on machines outside this server. Each has a wrapper its agent uses to deploy, restart and read logs there. Production stays behind a gate.',
  ],
  backups: [
    'Restic copies selected state off-site; the GitHub mirror copies eligible repositories. Both have exclusions. Recovery is proven by a successful copy and a tested restore, not by a schedule.',
  ],
};

export default features;
