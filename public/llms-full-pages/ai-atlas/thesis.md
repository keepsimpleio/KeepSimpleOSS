# Thesis: the edge now is solving hard problems with AI agents

Source: https://keepsimple.io/ai-atlas/thesis
Author: Wolf Alexanyan

> Vibe coding narrowed the gap between people in tech, so the edge now belongs to whoever can solve the hardest problems solo with AI agents.

Even where engineers still lead, the lead got shorter. What was ten years ahead a year ago is perhaps two years ahead now. And the gap closed because of vibe coding. Basically, you build software by telling an AI agent what you want, and that **enables solo building end to end**.

From the market’s perspective, a year ago you were worth as much as the complexity of the problems you could see as a product or business person. But to solve them, you needed a whole team. Now that limit is gone, and you can solve the problem you saw on your own.

**So today you are worth as much as the complexity of the problems you can solve.**

In turn, **complex problems require a higher mastery of working with LLM agents**. That mastery starts with questions, because any sophisticated software begins with them. What to ask takes business and product expertise. **How to ask is a second skill.** **It means framing the question, decomposing the answer and choosing the next question.**

Then at some point you realize that an LLM works on coherence, much as a brain does. It will answer any question with whatever fits best with what it was given, and it follows your framing. **So whoever does not learn to talk to an LLM properly becomes delusional.** **The cure is evals and benchmarks**. Evals test your work, and benchmarks test your choice of model.

The next thing you hit is the **context window**. One start of an agent on a task is one run. A run sees only what fits in its context window. A complex problem does not fit one context window. Past a point the window fills with everything the task has touched, and the model gets dumber and starts to hallucinate. That is **context rot**.

So you split the work into runs, and one agent’s output becomes the next agent’s input. Then you decide what each run sees and what it never sees. That is **context routing**. Runs, handoffs and context routing together make **orchestration**. This is how you solve a problem too big for one context window. However, at some point you understand that **orchestration without evals at each step is a delusion at scale**. Primarily because the error of the first run becomes a fact for every run after it. So you decide to build an eval for each step, and one for the whole chain too.

After a while some steps turn routine and no longer need a model, so you **replace it with code**. Code is cheaper and deterministic (which means it gives the same output every time). Where a step still needs a model, benchmarks tell you which one, or whether to add a second.

But every run still starts from zero, and whatever the system figured out yesterday is gone by the next one. So you give it **memory** that outlives a single context window and is shared between runs. Decisions go there, gotchas, what you tried and what failed. Only what passed an eval goes into memory, and a failure is stored as a failure. Otherwise the system starts remembering its own mistakes as facts.

Up to this point the orchestrator is you. You decide which run goes next, what it sees and where its output goes. Then you write an onboarding protocol, a short file that tells a new agent who it is and how it joins the system. Now **your agents start calling each other instead of you**. One drafts, another pushes back, the first one revises, and it all settles against your evals. A program now picks who wakes up and collects the results, and you step in only for the real decisions.

At some point **the system runs on its own**. You wake up, read what it built overnight, make sure you and your agents learned the gotchas, and set the next batch of tasks. Most of your time now goes into shaping a task the system can deliver by itself. So you are back to asking questions, only now you ask them of the whole system instead of one model. This is sophisticated orchestration, and **it lets one person solve problems that used to take a whole team.**
