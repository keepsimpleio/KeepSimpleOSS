/* ============================================================
   THE WORDS ON THE ATLAS. Wolf edits this file by hand.

   Each key is one card. Each string is one paragraph on that card;
   two strings means two paragraphs. Edit only what sits between the
   quotes. Do not rename a key: the key is what ties the words to the
   tile, and a renamed key silently falls back to the Terminal's own
   text.

   TILE: a black tile on the outer ring of the map. Twelve of them:
     Composites, Backlog, Message, Attachments, Queue, Tracks,
     Global CLAUDE.md, Session resume, Skills, Involve an agent,
     Conversation history, Saved decisions.
   card: every other card, opened from a stage, a ring or the Topics list.

   The NAME printed on a tile is not here, it comes from the guide
   (src/lib/aiAtlas/guide.json, field "title"). Change the words here,
   change the name there.

   A card with no entry in this file falls back to the guide's own text.
   ============================================================ */

const features: Record<string, string[]> = {
  /* ---------- the six stages of one task ---------- */
  // card: Project (stage 1)
  'stage-project-home': [
    'Every task starts with me choosing a project. A project is a folder with its own rules, its own memory and its own agent, so whatever I ask next is answered by someone who already knows that codebase and its history.',
  ],
  // card: I give a task (stage 2)
  'stage-task': [
    'I type the task in my browser the way I would brief a colleague: what has to change and what I expect at the end. The browser passes it to Terminal on my server.',
  ],
  // card: Terminal dispatches it (stage 3)
  'stage-terminal': [
    'Terminal is the dispatcher I built. It takes my message and routes it to the agent session of the project I picked, on the engine I picked. Nothing leaves my server except the call to the model.',
  ],
  // card: Agent prepares (stage 4)
  'stage-prepare': [
    'Before the agent touches anything it loads the rules. A fresh session reads the global rules, the project rules and the memory index. A session I return to resumes with what it already remembers.',
  ],
  // card: Agent works (stage 5)
  'stage-agent': [
    'The agent reads, edits, runs commands and asks colleagues, all on my server. Only the thinking happens at the model provider. I do not watch every step; the rules and the checks do that for me.',
  ],
  // card: I get the result (stage 6)
  'stage-result': [
    'The answer streams back to my browser. The code and the deployments stay in the project. I judge the result, and I am the only one who can call a task done.',
  ],

  /* ---------- giving a task ---------- */
  // TILE: Message
  message: [
    'This is where I brief the agent. I say what has to change and what result I expect, and I keep it short because the agent already has the rules and the history.',
    'The browser passes the text to Terminal. Nothing is added to it unless I turn a mode on.',
  ],
  // TILE: Attachments
  attachments: [
    'I attach a screenshot or a file instead of describing it. The agent works from what I show it, not from my retelling, which removes the round of "no, the other button".',
  ],
  // card: DEF / SIM
  'reply-mode': [
    'SIM is a switch for the reply, not for the work. With SIM on, Terminal tells the agent to answer me in short Russian while doing the whole task exactly as it would otherwise. I read a few lines instead of a page.',
    'DEF is the plain mode: the task goes as I typed it.',
  ],
  // card: Recipient & model
  recipient: [
    'Before I send, I pick who gets the task, which model runs it and how hard it should think. Each engine remembers my picks separately, so switching from Claude to Codex and back costs me nothing.',
  ],
  // card: Save work & decisions
  actions: [
    'Two things I ask for on purpose at the end of work: save the decisions, and push the code. I do not trust a chat to remember either.',
  ],
  // card: PREP
  'action-prep': [
    'PREP is the last step before an agent leaves: save the decisions of the session, then read them back and prove they landed. I run it because an agent’s memory of a session ends with the session.',
  ],
  // card: PUSH
  'action-push': [
    'PUSH commits the source changes and sends them to the project’s repository. The code is the record, the chat is not. Nothing I approved exists until it is pushed.',
  ],

  /* ---------- dispatch ---------- */
  // card: Engine
  project: [
    'Every project tile runs on Claude or on OpenAI’s Codex. I choose the engine per project, and Terminal runs the agent inside that project’s folder with that engine.',
  ],
  // card: Engine switch
  'engine-switch': [
    'Any project tile can run on Claude or on Codex, and I can switch. A switch mid-turn is refused; the agent finishes or stops first.',
    'A handover brief built from server state carries the work across, so nothing is retyped.',
  ],
  // TILE: Tracks
  tracks: [
    'Each engine has three tracks, one subscription each. A tile bills its track from its next turn. A track with no key, or one I turned off, refuses the move.',
    'This is how I decide which subscription pays for which project, and stop one without touching the rest.',
  ],
  // card: Message during a turn
  steering: [
    'I can write to an agent while it is working. On Codex the message steers the running turn; on Claude it enters the open turn directly. Terminal never parks the message for later.',
  ],
  // TILE: Queue
  queue: [
    'I can line up several tasks for one agent and walk away. Terminal holds the queue on the server and feeds the next task when the agent is free, in the order I set, even when my browser is closed.',
  ],
  // card: Execution order
  'timing-order': [
    'Queued tasks reach the agent one after another, in the order I set. I can stack an evening of work and read the results in the morning.',
  ],
  // card: Agent availability
  'timing-availability': [
    'The next task waits until its agent is free. The server checks before it dispatches, so two tasks never collide inside one session.',
  ],
  // card: Delayed start
  'timing-schedule': [
    'I can set when queued work may start. The first task fires when that time comes and the agent is free; the rest follow.',
  ],
  // card: Server-owned queue
  'timing-server': [
    'The queue lives on the server, not in a browser tab. I close the laptop and the work still happens.',
  ],

  /* ---------- preparing ---------- */
  // card: Agent onboarding
  onboarding: [
    'A new session gets an introduction before its first task. Codex is told to read the global rules, the project rules, then the memory index. Claude gets the project rules and its CLI loads the rest itself.',
    'A small facts file states which engine, model and mode the session runs on.',
  ],
  // TILE: Global CLAUDE.md
  global: [
    'One rules file sits above every project. It says how agents verify a claim before making it, how they talk to me, where their ownership ends and what counts as finished.',
    'Claude loads it by itself; Codex is told to read it first.',
  ],
  // card: Local CLAUDE.md
  local: [
    'Every project folder has its own rules at the root: how to work here, the design passport, what this agent owns. The agent reads it before touching anything.',
    'The standards of a project travel with the project, not with whoever happens to be working on it.',
  ],
  // TILE: Session resume
  'session-resume': [
    'I return to a session and it still holds its context. When the conversation has been compacted and forgotten, the saved memory remembers. Two layers, so neither one has to be perfect.',
  ],
  // card: Session end
  'session-end': [
    'I end a session by clearing it or killing it. A clear keeps the queue; a kill drops it into a 14-day trash. A scheduled end leaves a one-line epitaph, so I know how it ended.',
  ],
  // card: New project
  'new-project': [
    'When I create a project, Terminal runs my project script: it prepares the workspace and the starting rules. Opening the project starts its agent’s first turn.',
  ],
  // card: New agent
  'new-agent': [
    'An agent is born the first time I open its project, named after the folder. Its first turn reads the rules and lists the open backlog, so it starts oriented, not blank.',
  ],

  /* ---------- working ---------- */
  // card: Project owners
  directory: [
    'A registry says who owns which project. An agent that needs something from another project asks that project’s owner instead of walking in and doing the work itself.',
    'Ownership is the rule everything else hangs on.',
  ],
  // card: MEMORY.md
  memorymd: [
    'Each project keeps a short index of what it already learned, one line per lesson, pointing at the full note. The agent loads it at the start of a session.',
    'That is how a correction I gave in spring still holds in autumn.',
  ],
  // card: MemPalace
  palace: [
    'MemPalace is the store where decisions survive. An agent files what we agreed, and a new session searches it before asking me the same question again.',
    'It is organized by project and searchable by every agent.',
  ],
  // TILE: Skills
  skills: [
    'A skill is a written method for one kind of work: how to release, how to review, how to write in the house style. The agent opens the matching skill and follows it instead of improvising a process each time.',
  ],
  // card: Tools
  tools: [
    'Tools are how the agent acts: edit a file, run a command, query a database, reach a service. Every result comes back to the agent, which decides the next step.',
    'What a tool can do and what the agent is allowed to do are two different questions. The rules answer the second.',
  ],
  // TILE: Involve an agent
  sendto: [
    'An agent that needs something from another project’s owner writes one line addressed to that colleague. Terminal delivers it into the colleague’s own session and brings the answer back.',
    'The two conversations stay separate, so nobody’s context fills up with someone else’s work.',
  ],
  // card: Ask once
  'ask-once': [
    'One agent asks another one question. Terminal delivers the ask into the colleague’s own session, with that project’s context, and returns the answer.',
    'Two hops is the limit, so a question cannot bounce around the team forever.',
  ],
  // card: Auto Mode
  auto: [
    'Auto Mode lets a pair of agents I armed pass work back and forth through the server with my browser closed. It stops at the hop limit or when a message repeats, so a loop cannot run away.',
  ],
  // card: Background work
  'background-work': [
    'A process can keep running after the agent’s turn ends: a build, a deploy, a long probe. Terminal tracks it and accepts my next message meanwhile.',
    'A background process alone never wakes the agent. My message does.',
  ],
  // card: Code map
  codemap: [
    'CodeGraph indexes every symbol in a project. On the Claude lane, doors redirect whole-file reads and searches into the index, so the agent reads the function it needs instead of the whole file. Codex calls the index directly.',
  ],
  // TILE: Composites
  keys: [
    'Keys are proven structures I can build into any project: a design passport, a health watcher, a set of gates. Each key carries a specification the agent builds from, never a copy of another project’s code.',
    'Before a key is built, the agent asks its intake questions and records my answers with the key, so nobody asks twice. Building goes through intake, contract check, execution, mechanical proof and a version record, every step journaled. Only a key that finished this path counts as lit.',
    'A weekly sweep tells me which project runs an outdated version. It stays silent when everything is current.',
  ],
  // card: Rule checks
  'work-checks': [
    'Rules on paper are not enough; I check them while the work happens. On the Claude lane, hooks I call Doors fire at fixed moments: when a task is submitted, before a read, after every edit, at the end of a turn.',
    'A triggered door means the agent fixes the work before it can continue. Codex has no such hooks.',
  ],
  // card: Monitoring
  monitoring: [
    'After an agent finishes, the project still needs watching. Enrolled watchers check that a project is up and delivers what it declared, and report a failure to me on Telegram naming the owner.',
    'They never repair. A person does.',
  ],
  // TILE: Backlog
  backlog: [
    'Each project has a backlog. Tasks wait there until an agent takes them. The agent marks delivered work for review; only I close it.',
    'An agent cannot declare its own task done.',
  ],

  /* ---------- the result ---------- */
  // card: Delivered work
  'delivered-work': [
    'The agent reports what changed and what it checked. The work itself stays in the project as files, commits and deployments. I read the report against that evidence, not on its own.',
  ],
  // card: Review result
  'review-result': [
    'I judge the result and send it back if it is wrong. A backlog task closes on my confirmation, never on the agent’s word.',
    'LOOP is the assessment path I use when I want options: the agent reads the project’s evidence and offers three candidates with metric, baseline, gain, cost and risk. I pick one.',
  ],
  // card: Notification to me
  notify: [
    'Telegram is where the system reaches me. Watcher failures, Arena outcomes and lines an agent forwards to a human land there. Reception takes a task from a person I granted access and returns the result to their private chat.',
    'Reception shows execution and delivery as two facts. The task finishing makes the result available; delivery is confirmed only by the courier’s record. Accepting it is my call.',
  ],
  // TILE: Conversation history
  history: [
    'Every session keeps its whole conversation, so I can come back to it. An archive keeps sessions past the CLI’s own retention, and a full-text index searches all of them.',
    'When an agent tells me "we never did that", I can check.',
  ],
  // TILE: Saved decisions
  decisions: [
    'A decision that lives only in the chat is lost. The agent has to write it into project memory or MemPalace, and I check that it did.',
    'A final reply saying "noted" is not a save.',
  ],
  // card: Automatic memory capture
  'auto-capture': [
    'On the Claude lane, hooks save memory when a session stops and before its context is compacted. Codex saves through its memory tools.',
    'PREP is the deliberate save on top of that: it saves and reads back.',
  ],
  // card: Discipline feedback
  discipline: [
    'Audits of past sessions write a notice the agent reads at its next start: its discipline score, lessons from colleagues, my rulings and my hand edits to its work.',
    'An agent that broke a rule yesterday learns it before its first task today.',
  ],
  // card: Turn measurements
  phases: [
    'Every finished turn writes one line: how long the command waited for the provider, how long to the first word, how long to the end, per engine and slot. Every five minutes another line records server stalls. No prompt text is stored.',
    'This is how I know whether slowness is mine or the provider’s.',
  ],

  /* ---------- the system around a task ---------- */
  // card: Wolf
  wolf: [
    'I set the direction and decide who owns what. Agents work inside the authority I already gave them; whatever needs my call waits for it.',
    'I am the only human in the loop, and the loop is built so that one human is enough.',
  ],
  // card: The Order
  order: [
    'The Order is my server agent. It owns the shared infrastructure and the access boundaries, and it executes restarts and rebuilds itself instead of bouncing them back to me.',
    'Project agents ask it only for what is central. Everything inside their own project they run themselves.',
  ],
  // card: Project agents
  agents: [
    'Terminal runs one session per project. The directory says who owns what; an agent that needs a colleague asks the owner instead of doing the owner’s work.',
    'One owner per project is the rule that keeps dozens of agents from stepping on each other.',
  ],
  // card: Memory
  memory: [
    'Project notes and MemPalace carry earlier decisions into later work. They are separate from the live conversation and its session history, so a decision outlives the session that made it.',
  ],
  // card: Tools & workspace (system ring)
  'system-tools': [
    'Tools read and change project work within what the project was authorized to do. What a tool can do and what it may do are two different questions, and the rules answer the second.',
  ],
  // card: Model providers
  models: [
    'The thinking happens at the provider. Claude and Codex send the conversation to their model providers; the tools run on my server and reach only the hosts a project is allowed to touch.',
  ],
  // card: Terminal
  terminal: [
    'Terminal is where a task lives: it opens here, runs here and comes back here. Its branches and selections stay exactly as I left them.',
  ],
  // card: Cloudflare
  access: [
    'Nothing on my server listens to the internet directly. Cloudflare Tunnel publishes the web apps, and Access checks who you are before an internal one opens. Public sites answer anyone; everything else asks for identity first.',
  ],
  // card: Connected services
  services: [
    'Agents reach the outside through connected tools: a GitHub repository, a headless browser for pages a plain request cannot read, a spreadsheet, an analytics feed. Each connection has its own scope.',
  ],
  // card: Telegram
  telegram: [
    'Telegram carries alerts and my voice tasks. Reception takes a task from a person I granted full access and returns the result to their private chat. It is the channel that works when I am away from a desk.',
  ],
  // card: Secrets
  secrets: [
    'The Order keeps the shared credentials. A project operator gets the ones its grant names and none of the others. The reach of a leaked key is limited by design.',
  ],
  // card: Server cockpit
  apex: [
    'The server cockpit shows every Docker service and carries the operations I allow over SSH. Changes to shared infrastructure go through The Order.',
  ],
  // card: Project services
  projects: [
    'Dozens of project services run on this host behind loopback ports and the Tunnel. Some bind to the tailnet; some live on their own servers. Each belongs to exactly one agent.',
  ],
  // card: Project operators
  deploy: [
    'Project operators deploy, restart and read logs within my recorded grants, remote hosts included. Shared infrastructure stays with The Order. Scheduled work runs on host cron or inside services.',
  ],
  // card: Run records
  records: [
    'Session history and mechanism journals keep what happened. An agent’s final answer is a claim; the journal is the proof.',
    'Every mechanism I ship leaves a trail, one line per run.',
  ],
  // card: Watchers
  watchers: [
    'Watchers probe enrolled projects and report failures. Trivy scans images and hosts for vulnerabilities. They report; repairing is a person’s job.',
  ],
  // card: Recovery
  recovery: [
    'Restic copies selected state off the server every night, encrypted. Coverage has exclusions. A snapshot counts once it exists and a restore has been tested.',
  ],
  // card: Other hosts
  remote: [
    'Some projects run on machines outside this server. Each has a wrapper its agent uses to deploy, restart and read logs there. Production stays behind a gate.',
  ],
  // card: Backup storage
  backups: [
    'Restic copies selected state off-site; the GitHub mirror copies eligible repositories. Both have exclusions. Recovery is proven by a successful copy and a tested restore, not by a schedule.',
  ],
};

export default features;
