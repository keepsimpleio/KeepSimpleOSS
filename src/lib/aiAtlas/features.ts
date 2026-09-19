/* ============================================================
   THE WORDS ON THE ATLAS. Wolf edits this file by hand.

   Each key is one card. Each string is one paragraph on that card;
   two strings means two paragraphs. Edit only what sits between the
   quotes. Do not rename a key: the key is what ties the words to the
   tile, and a renamed key silently falls back to the Terminal's own
   text.

   TILE: a black tile on the outer ring of the map. Fifteen of them:
     Composite Keys, Backlog, Message, Smart Queuing, Engine switch,
     Live Steering,
     Global CLAUDE.md, Local CLAUDE.md, Session start, Doors,
     AI Collaboration, Human Collaboration,
     Conversation history, Saved decisions, Discipline.
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
    'Every task starts with me picking a project. A project is a folder with its own rules, its own memory and one agent that owns it, so whatever I ask next is answered by someone who already knows this codebase and what went wrong in it before.',
    'The project also carries what I decided before the task: the Keys I activated, which fix how it is built, and the backlog, where my ideas for it wait. I do not explain any of that in the task. It is already there.',
  ],
  // card: I give a task (stage 2)
  'stage-task': [
    'I brief the agent the way I would brief a colleague: what has to change and what I expect at the end. Typed, spoken or sent from Telegram, with a screenshot when showing beats describing.',
    'Before it goes I pick who gets it, which model thinks and how hard, and whether I want a full answer or a few lines. One task or fifteen in a queue, the server takes them the same way and runs them with my browser closed.',
  ],
  // card: Terminal dispatches it (stage 3)
  'stage-terminal': [
    'Terminal is the dispatcher I built. It takes my message and puts it into the session of the project I picked, on the engine I picked, on the subscription I put that project on. Nothing leaves my server except the call to the model.',
    'If a track runs dry the work moves to another one with its context intact. And a running agent is not a closed door: I can write to it mid-turn and it corrects where it stands.',
  ],
  // card: Agent prepares (stage 4)
  'stage-prepare': [
    'Before the agent touches anything it loads the law. The global rules say how it talks to me, where its authority ends and what counts as done. The project rules say what this codebase demands and what broke here before. Then it reads the decisions we already made and the notice about its own last day.',
    'So a fresh session starts already knowing what we settled, and it does not ask me twice.',
  ],
  // card: Agent works (stage 5)
  'stage-agent': [
    'The agent reads, edits, runs commands and asks colleagues, all on my server. Only the thinking happens at the provider. I do not watch every step. Doors do: small programs at fixed moments of the turn that send the work back when it is off, with no flag to switch them off.',
    'What lies outside its project it does not touch. It asks the owner by name, agent or person, and the answer comes back into its own session.',
  ],
  // card: I get the result (stage 6)
  'stage-result': [
    'The answer streams back to my browser; the code and the deployments stay in the project. I read the report against the evidence, and I am the only one who can call a task done.',
    'A task does not end when I read it. The conversation is kept and searchable, the decisions are written where the next session finds them, and what I sent back is read overnight and becomes a rule before the next morning. That is the arrow from Result back to Project.',
  ],

  /* ---------- giving a task ---------- */
  // TILE: Message
  message: [
    'There are three ways a task gets into Terminal. I type it, with screenshots and files attached whenever showing beats describing. I speak it, straight into Terminal. Or I send it from Telegram, where my agents are one chat away and my voice is transcribed on arrival.',
    'The Telegram lane carries its own rules, and they hold even if someone clones my voice. A voice that sounds like mine is not authority by itself.',
    'Every message goes to my server, so I am never tied to one machine. Phone, laptop, a borrowed browser, the work sits in the same place either way. I had this running long before Anthropic and OpenAI shipped anything like it.',
  ],
  // card: Attachments
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
    'Terminal runs both Claude and Codex, and under each of them I keep three to five tracks active at any time. A track is a subscription. On a normal day that is around five Claude subscriptions and five Codex subscriptions standing ready.',
    'Moving between them is soft. The work hands over to another track with its context carried across, so nothing breaks in the middle of a task. The same holds when I move a project from Claude to Codex: the agent finishes or stops first, then a brief built from server state carries the work over and nothing is retyped.',
    'That dispatcher is its own engine. It runs my Terminal, and it also runs inside the products I build, so those projects get the same failover I do.',
  ],
  // card: Tracks
  tracks: [
    'A track is one subscription. A tile bills the track I put it on from its next turn, and a track with no key, or one I turned off, refuses to take work.',
    'This is how I choose which subscription pays for which project, and stop one without touching the rest.',
  ],
  // TILE: Live Steering
  steering: [
    'An agent being busy does not mean I have to wait for it. I can write to it while it works, and the message goes into the turn that is already running instead of sitting in a queue until it finishes.',
    'So when I see it heading the wrong way, I say so now, and it corrects there. Terminal never parks a message of mine for later.',
  ],
  // TILE: Smart Queuing
  queue: [
    'I can stack a pile of commands in the order I want, hand them to an agent and walk away. The server runs them one after another with my browser closed.',
    'Every command in the queue carries its own model, so one task can open on a fast cheap model and finish on the strongest one, with the context carried across.',
    'System commands go in the same line. PREP files the key decisions of the work so far into my agents’ memory. Clear empties the context window. So I can queue fifteen commands knowing that after the heavy ones the agent saves what matters into a memory drawer on my server and then starts clean, instead of degrading as the window fills up.',
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
    'One rules file sits above every project, and every session reads it before it does anything. It is where I put what I want to be true everywhere: how an agent talks to me, where its authority ends, what counts as finished.',
    'It also introduces the agent to the rest of the server. There are dozens of agents here and around ten people, and the roster holds all of them the same way, with the same handles. An agent that needs something outside its own project addresses the owner by name in one line. If that owner is a person, the line leaves the server and reaches them on Telegram. That is the real onboarding: on its first turn a session already knows who exists, who owns what, and who to ask.',
    'The rule I care about most is the one about evidence. An agent may not certify its own work. Done is earned by something that cannot argue back, an exit code, a live probe, a test that actually ran, or by another agent with a clean context checking it. Its own report does not count.',
    'The same file carries the logging law: anything an agent builds has to leave a trail of its own runs, one line per run, next to the thing itself. A mechanism that acts and leaves no record is a defect, however well it works.',
    'None of this was written in advance. Every line in that file is there because something broke once, and I audit it every month against what went wrong.',
  ],
  // TILE: Local CLAUDE.md
  local: [
    'Every project folder has its own rules at the root, and its agent reads them before touching anything. In practice that file is three things stacked on each other.',
    'The first layer is the composite keys I activated here. A key leaves its law in the file: the UI passport fixes this project’s type scale, its one accent and its contrast floor, and off-passport is a violation rather than a preference. The security passport does the same for what may be exposed. So the standards of a project belong to the project, not to whoever is working on it today.',
    'The second layer comes from the template every new project is born with. Some of it is unglamorous and matters anyway: what the thing is for, which vendor credits it burns, and a checklist for shutting it down properly if I ever kill it. A project knows how to die from the day it is born.',
    'The third layer is the one that cannot be copied from anywhere. It is the record of what went wrong here: dated lines, most of them written the day something broke, saying what not to do again in this codebase. That is why an agent opening a project it has never seen still works like it has been here for months.',
    'All of it runs against a budget. What I am aiming for is an agent that fits in around three hundred lines of rules, global and local together. Every line I add is attention the agent spends on me instead of on the work, so a rule either earns that or it comes out.',
  ],
  // TILE: Session start
  'session-resume': [
    'A session does not open empty. A hook on my server hands the agent the last decisions parked for this project, newest first, before I have said a word. It starts knowing what we already settled, so it does not ask me again.',
    'It also reads a notice about itself. Every night a scan with no model in it goes over that agent’s last day of transcripts and writes down where it broke the charter, next to my rulings and the edits I made by hand to its work. The agent reads that before its first task, so a rule it broke yesterday is the first thing it sees today. The notice clears itself after a clean day.',
    'When I come back to a session it still holds the conversation. When I start a fresh one it is rebuilt from the layers that outlive any conversation: the global rules, the project rules, the memory index and that brief. So a new session is not a worse agent, it is the same agent with a lighter head, which is why clearing context costs me nothing.',
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
  // card: Skills
  skills: [
    'A skill is a written method for one kind of work: how to release, how to review, how to write in the house style. The agent opens the matching skill and follows it instead of improvising a process each time.',
  ],
  // card: Tools
  tools: [
    'Tools are how the agent acts: edit a file, run a command, query a database, reach a service. Every result comes back to the agent, which decides the next step.',
    'What a tool can do and what the agent is allowed to do are two different questions. The rules answer the second.',
  ],
  // TILE: AI Collaboration
  sendto: [
    'Every project belongs to one agent. When an agent needs something from another project, it asks that project’s owner instead of going in and doing it.',
    'It names the colleague in one line. The question lands in that colleague’s own session, with that project’s files and rules around it, and the answer comes back. The two conversations stay separate.',
    'A question can travel two hops and no further. If I arm a pair of agents, they can pass work back and forth on my server with my browser closed. That stops at the hop limit or when one of them repeats itself.',
  ],
  // TILE: Human Collaboration
  'human-collab': [
    'The roster on my server lists people the same way it lists agents, with handles.',
    'When an agent needs something only a person can give, a credential, a decision, a fact nobody wrote down, it addresses that person by name in one line. The line leaves the server and lands in their Telegram.',
    'It works the other way too. Someone I granted access hands a task to my agents from their own chat and gets the result back there. Execution and delivery are shown as two separate facts, because a task finishing is not the same as the answer reaching a person.',
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
  // TILE: Composite Keys
  keys: [
    'I have been shipping software for over ten years. After a few months of building project after project with my agents, I ran a research over all of it to find the things I do most often, and then picked out the ones that can be automated. Those became Keys, aka Composites.',
    'A Key is not a skill. A skill tells an agent how to do one kind of work. A Key holds everything a capability needs: where it should go, checks that run in git and fail loudly, access to an agent that holds the credentials for some API, how the interface behaves, what data it may not touch. Some Keys also point at a skeleton of the thing, so the agent starts from real ground instead of an empty folder.',
    'I also built a cross-key orchestration mechanism, so depending on what keys are active, the agent will be re-organizing his approach to building.',
    'Activating a key is not silent. The agent comes back with a few questions to calibrate it to this project, and my answers stay with the key, so nobody asks me twice.',
    'When I start a new project I just activate the needed keys to have 40-80% of work done upfront with a single prompt. That is the bootstrap, and on a big one the agent goes away and works alone for a few hours before it shows me anything. With the right Keys active I can write one prompt and have a working B2B service the next morning, built the way I would have built it, with interface interactions I want, limits I need etc.',
  ],
  // TILE: Doors
  'work-checks': [
    'I got tired of agents agreeing with a rule and then breaking it an hour later. Reading a rule and following it turned out to be two different things, so I stopped writing rules and started running them. Doors are small programs that sit at fixed moments of a turn. When one fires, the agent goes back and fixes the work. There is no way to skip it and no flag to turn it off.',
    'The first one meets my task. It makes the agent say out loud how it understood me before it starts building the wrong thing. The next one stands in front of every file read, because I watched agents burn half their context reading whole files to find one function. Now that read goes into a symbol index instead.',
    'Then there is a row of them after every edit, and those came from real damage. Type sizes and colours get checked against the project’s passport, because agents kept inventing a nicer shade. Animations get checked for reduced motion. Layout gets checked for things that jump under the cursor. And the text gets read for AI filler, after I found the word seamless sitting in one of my own modals.',
    'The last door stands at the end of the turn and it is the one I care about most. An agent cannot tell me the work is done unless the same turn contains something that cannot argue back: a command it ran after the change, a probe, a read-back. I have been told done too many times by something that never checked.',
    'Every one of these exists because of a specific bad day. Arguing with a door, editing it, going around it, all of that is worse than the original mistake.',
  ],
  // card: Monitoring
  monitoring: [
    'After an agent finishes, the project still needs watching. Enrolled watchers check that a project is up and delivers what it declared, and report a failure to me on Telegram naming the owner.',
    'They never repair. A person does.',
  ],
  // TILE: Backlog
  backlog: [
    'The backlog does two things for me. The first one is memory for my own ideas. Anything I think of for a project goes in there instead of into my head, and the agent that owns the project can read it whenever it needs to know where this thing is going.',
    'The second one is how Composite Keys stay current. When I improve a key at the root, every project running that key gets a task in its backlog to check with me whether it should take the update. Say I changed how an interface behaves, or something about a payment flow. The agent does not quietly rewrite itself, and the improvement does not get lost either. It comes to me as a question, per project.',
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
    'Every session keeps its whole conversation, and an archive holds it past the CLI’s own retention. One full-text search runs across all of them, so when an agent tells me "we never did that", I check.',
    'The reason I keep them is what happens once a month. The whole record is read back: every task I gave, every correction I had to make twice, every place the work stalled or came back wrong. What returns is a list of proposals, each carrying the evidence it came from, and each naming the exact thing to change. A line in one project’s own rules. A line in the global rules every agent reads. The way the queue orders my work. A composite key that carries the same flaw into every project built from it.',
    'I accept or refuse each one myself. What I accept is in the rules by the next session, so a month of me repeating myself becomes something the system does on its own.',
  ],
  // TILE: Saved decisions
  decisions: [
    'A decision that lives only in the chat is lost. The agent writes it into project memory or MemPalace, and I check that it landed.',
    'A reply saying "noted" is not a save.',
  ],
  // TILE: Discipline
  discipline: [
    'A result I send back does not stop at me. Every night a scan with no model in it reads that agent’s last day: where it broke the charter, what I ruled, and every edit I made to its work by hand.',
    'It comes back as a notice the agent reads before its first task the next morning, so a rule it broke yesterday is the first thing it sees today. The notice clears itself after a clean day.',
    'Once a month the same evidence goes against the global rules. A mistake that keeps coming back stops being a notice and becomes a rule everyone reads, or a door nobody can walk around.',
  ],
  // card: Automatic memory capture
  'auto-capture': [
    'On the Claude lane, hooks save memory when a session stops and before its context is compacted. Codex saves through its memory tools.',
    'PREP is the deliberate save on top of that: it saves and reads back.',
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
    'The Order is my primary orchestrator. It holds every key the doors answer to, owns the shared infrastructure and the access boundaries, and knows close to everything that happens on the server. Restarts and rebuilds it executes itself instead of bouncing them back to me.',
    'It is also the only agent that reaches me on its own. When it needs something, it writes to me on Telegram, and when it cannot wait, it calls my phone and wakes me up.',
    'Project agents ask it only for what is central. Everything inside their own project they run themselves.',
  ],
  // card: Colleagues (resource ring)
  agents: [
    'Two kinds of colleague, one roster. Agents, one per project, each the only one that changes its project. People I granted access, listed the same way, addressed by handle, reached on Telegram when a line is for them.',
    'Anything outside an agent’s own project is a question to a named owner. Each carries the authority I wrote down for it and no more; past that line it asks me and waits.',
  ],
  // card: Memory (resource ring)
  memory: [
    'Memory here is layers, and each layer answers a different question. The conversation itself, every session archived and searchable, answers whether we ever did this. Project memory, one note per lesson with a short index the agent loads at start, answers what this codebase demands. MemPalace holds the decisions, filed with PREP and handed back at the next session start. Every mechanism keeps a journal, one line per run, and every finished turn writes its timings.',
    'Every layer gets read back. A weekly scan goes through each project’s notes, keeps the lessons that would hurt another project, and sends me a numbered digest on Telegram; I answer by index, and a promoted line goes into the global rules by hand. A monthly audit of the transcripts tells me where agents broke the charter. When I asked whether PREP was worth its cost, the answer came from the same data: 41% of sessions end with a save, and most of the palace turned out to be auto-mined noise drowning the drawers I filed by hand, so search now skips it.',
  ],
  // card: Tools (resource ring)
  'system-tools': [
    'What a tool can do and what the agent may do are two different questions. The rules answer the second.',
    'Tools are how an agent acts, and most of mine are my own. CodeGraph indexes every symbol of a project, so the agent reads the one function it needs instead of the file. MemPalace holds the decisions. A headless browser reads the pages a plain request cannot. Each project has a lever for its own containers, deploy, restart, logs, a shell, within what I granted it.',
    'The network is a tool too. Tailscale joins my servers into one mesh, so an agent on one of them reaches another by hostname, wherever it stands. My own VPN and my own pool of proxy servers are there for the work that needs a different exit.',
  ],
  // card: Models (resource ring)
  models: [
    'The thinking happens at the provider. Today that is Claude and OpenAI’s Codex, several subscriptions of each, and the tools stay on my server whichever one is thinking.',
    'The switch between them is my own code, so a third engine is a slot on it and not a rewrite. The groundwork for local models is in place: the box is chosen, the model is picked and the plan is written. It is not running yet, and the atlas says so.',
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
    'A grant covers execution and never the decision. Deleting data, opening a port or touching production needs my go, and where the lever supports it my words are quoted in the command and kept in its journal.',
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
