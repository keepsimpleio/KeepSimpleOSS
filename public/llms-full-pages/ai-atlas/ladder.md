# The AI agent ladder: 16 rungs from chat to a system of agents

Source: https://keepsimple.io/ai-atlas/ladder
Author: Wolf Alexanyan

Where you stand with AI agents and what to learn next: 16 rungs from chat to Claude Code, evals, orchestration and memory, each with the skill for the next step.

## Stage I. Solo: you and one run

### 0. Chat

_You ask, it answers. It talks, you act._

- Wrong perspective: It knows the answer.
- Right perspective: It predicts a likely answer, and a likely answer can be wrong.
- Vibecoding skills: You decided to check what ChatGPT, Claude or Gemini says before you use it.

You open ChatGPT, Claude or Gemini and type. Behind each chat there is an LLM, a large language model: GPT from OpenAI, Claude from Anthropic, Gemini from Google.

An LLM is a compressed statistical model of language. It predicts the next piece of text, so a wrong answer sounds as sure as a right one.

Most LLM users are here. This is important to understand, because these are the people LLM companies actually build their features for.

Tools:

- ChatGPT, Claude or Gemini, in the browser or on the phone

### 1. Agent

_You let it run commands on its own._

- Wrong perspective: AI is something I ask for advice.
- Right perspective: AI is something I hand work to.
- Vibecoding skills: You decided to run Claude Code or Codex in a terminal with bypass mode on and let it act.

The same models also come as agents that work on your computer. Claude Code runs on Claude, Codex runs on GPT.

You switch on bypass mode, so it stops asking your permission, and let it run commands on its own. This is where your chatbox becomes an agent, because agency means it acts by itself. Every time you start it on a task, that is one run.

Before you let it act, keep the project in git and save a version before every run, so a run that breaks something is undone by going back to that version. Read what it changed before you accept it, and never let it see your passwords and keys.

From here two things grow in parallel. One is its mind: memory, context, judgment. The other is its hands, the tools it can touch: the terminal, files, the web, other services through their APIs, and MCP servers, which are plug-ins that connect it to those services.

Connect it to your calendar through an MCP server, and it books the meeting itself instead of telling you how.

Tools:

- Claude Code, Codex or another vendor’s command-line agent
- A terminal with permission to act
- Git

### 2. Standing instructions

_The file it reads every time._

- Wrong perspective: It remembers what I told it last time.
- Right perspective: It knows only what is written down for it.
- Vibecoding skills: You decided to keep a global CLAUDE.md and one per project.

You find CLAUDE.md, the instruction file the agent reads every time you start it, but you barely touch it. So it runs on whatever it happened to pick up from talking to you.

Later you learn there are two of them. The global one says who the agent always is, and the project one says what this project needs.

Tools:

- CLAUDE.md for Claude Code
- AGENTS.md for Codex

### 3. Context rot

_You keep adding to the file and the model gets dumber._

- Wrong perspective: The more I give it, the smarter it gets.
- Right perspective: Past a point, more context makes it dumber.
- Vibecoding skills: You decided to keep CLAUDE.md under 200 lines and move the rest into documents it opens when needed.

The context window is everything the model sees at once. Whatever is outside it does not exist for the model.

You keep adding to CLAUDE.md, the task pulls in more and more files, and at some point the window gets so full that the model gets dumber and starts making things up. That is context rot.

An agent is only as honest as its context, so you learn to keep the file tight, global and project files together under about 200 lines. Everything else goes into documents the agent opens only when it needs them.

### 4. The question

_One goal per request, with everything that goal needs._

- Wrong perspective: A bad answer means a weak model.
- Right perspective: A bad answer usually means a bad question.
- Vibecoding skills: You decided to put one goal in each request and say what the answer must contain.

You stop throwing a wish into the box and start framing the question. You say what exactly you want and what the answer must contain, and after reading the answer you choose the next question.

An LLM works with meaning the way a person does, so how you frame the question changes the answer you get. It also follows your framing, so a leading question gets you agreement. Whoever talks to it badly becomes delusional.

### 5. Evals

_You stop guessing and start measuring._

- Wrong perspective: It looks right, so it works.
- Right perspective: Nothing works until a test says so.
- Vibecoding skills: You decided to write tests and bring in a Judge agent that checks the first one.

You write evals, small tests that prove the result still works. Before the run starts, you write down what done means.

Almost everyone skips this step, and this is where you start measuring instead of hoping.

Here you also bring in a Judge agent, a second model whose job is to check the first one. It can be your QA agent, or in my case, The Order. The idea is to automate your evaluation.

Tools:

- The test runners you already use
- A Judge agent
- Scripts that read the output and say pass or fail

### 6. Benchmarks

_The same task on another model, another vendor._

- Wrong perspective: I found my model.
- Right perspective: The best model for my task changes every few months.
- Vibecoding skills: You decided to write a script that sends the same task to several vendors and scores each with your evals.

You run your own task on models from different vendors and compare speed, cost and how often the eval passes. Which model is good at what changes every few months, so you keep track.

Picking the wrong model can be a costly mistake, and from inside one chat you will never see it.

Tools:

- A subscription or an API key per vendor
- One script that sends the same prompt to each
- Your evals from LVL 5 as the score

## Stage II. Orchestration: you and a system of runs

### 7. Decomposition

_One context window runs out, so you split the work into several runs._

- Wrong perspective: One smart agent can do the whole thing.
- Right perspective: A big problem is a chain of small runs.
- Vibecoding skills: You decided to start subagents and pass files from one run to the next.

The task no longer fits into one context window, so you cut it into subtasks. Each subtask gets its own run with a fresh context window, and one agent’s output becomes the next agent’s input.

You feel the cost right away: handoffs between agents, and drift away from the goal. Over time you learn to split only when the work does not fit one context window.

Tools:

- Subagents, which are agents your agent starts for one piece of the work
- Task queues
- Plain files passed from one run to the next

### 8. Context routing

_Who gets which part of the context, and who never sees it._

- Wrong perspective: Give every agent everything, just in case.
- Right perspective: What a run does not see cannot mislead it.
- Vibecoding skills: You decided to keep a list per step of what the run receives and where it may write.

Each run gets what its step needs: the task description, the previous output, the files it must read. It does not get anything that could bias it.

Up to LVL 11 you are the one who decides this for every step, so the orchestrator is you. At LVL 12 a program takes over that role.

Tools:

- A list per step of what the run receives
- Inputs it can read but not change
- A rule for what a run may write and where

### 9. Evals at every step

_And one on the whole chain._

- Wrong perspective: I check the result at the end.
- Right perspective: Every step needs its own check, or the first mistake spreads through the chain.
- Vibecoding skills: You decided to put an eval between runs, so a failed step passes nothing on.

A mistake in the first run becomes a fact for every run after it. So each step gets its own eval, and the whole chain gets one too.

Orchestration without evals at each step is a delusion at scale. A step that fails its eval does not pass its output on.

Tools:

- The same evals from LVL 5, now placed between runs

### 10. Code over model

_You tear down half of what you built._

- Wrong perspective: More AI makes the system better.
- Right perspective: Wherever a step is predictable, code does it better than a model.
- Vibecoding skills: You decided to turn routine steps into ordinary functions and hooks that check the output.

At some point you tear down half of what you built to make it leaner. Every step that became routine turns into code.

Code is cheaper and gives the same output every time, and you test it like any other function. The model stays only where there is real uncertainty.

A lean core is easier to manage and, importantly, to trust.

Tools:

- Ordinary functions
- Schedulers
- Validation scripts
- Hooks that check the agent’s output before it lands

### 11. Memory

_What survives a session and is shared between runs._

- Wrong perspective: Each session is a fresh start.
- Right perspective: What the system learned has to outlive the session, if it passed an eval.
- Vibecoding skills: You decided to give each agent a memory file and every run a shared store to search.

You find MEMORY.md, memory that outlives one context window and is shared between agents. Decisions go there, gotchas, what you tried and what failed.

Only what passed an eval goes into memory, and a failure is stored as a failure. Work accumulates, and smart-in-the-moment turns into smart-over-time.

Tools:

- A memory file per agent
- A shared store every run can search
- Full-text search over past sessions

### 12. Agents call each other

_An orchestrator picks who wakes, hands off, collects._

- Wrong perspective: I have to drive every step myself.
- Right perspective: My job is the decisions, and the agents handle the handoffs.
- Vibecoding skills: You decided to write an onboarding protocol and a message format your agents share.

You write an onboarding protocol that tells a new agent who it is and how it joins. Now your agents call each other instead of you.

One drafts, the Judge pushes back, the first one revises, and it all settles against your evals. You step in only for the real decisions.

Tools:

- A list of agents and how to reach each
- A message format they all use
- An orchestrator with a cap on how many times a task can bounce between agents

### 13. Autonomy

_Your agents run on their own._

- Wrong perspective: My work is doing the task.
- Right perspective: My work is shaping tasks the system can deliver without me.
- Vibecoding skills: You decided to set up schedules and watchers, so the system runs overnight and leaves logs.

Your daily routine is to wake up and see what they built during the night. You make sure you and your agents learned the gotchas. Then you build the next batch of tasks.

Most of your own time goes into shaping a task that fits your system, so it delivers by itself.

Without you, no agent spends money, deletes anything or publishes anything.

Tools:

- Schedules
- Watchers that alert you
- Logs, so every mechanism leaves a trail you can read in the morning

### 14. Departments

_Teams of agents, each with its own discipline._

- Wrong perspective: I run a set of agents.
- Right perspective: I run something closer to a company.
- Vibecoding skills: You decided to group your agents into departments, each with its own Judge, and let a product manager agent run whole projects through them.

Highly speculative, I’m not here yet.

You build departments of agents: marketing, business development, engineering with devs and QAs. Each has its own Judge and follows the protocol, and all of them know about each other.

Next you bring in a product manager agent that builds whole projects overnight using your departments. Nobody has shipped this yet.

### 15. ???

_One day._

At that point you have stopped renting a model to talk to and started owning the system around it.
