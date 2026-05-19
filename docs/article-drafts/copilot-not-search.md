# I set out to build a search bar, I ended up with a copilot.

This one's more technical than my usual. It starts with something I've wanted for years — a global search on keepsimple.io that could help visitors navigate the hundreds of pieces we've put on the project.

What stopped me, for years, was the same thing that probably stops you from using most website searches — they suck. You use one once, the result is mediocre, and you forget the search bar exists. I didn't want dead weight on the project. A project like keepsimple, full of unique work, deserves a search built for it — one that's actually friendly.

The other constraint was cost. The project is self-funded and I can't stretch the budget. If I mess up with LLM or service APIs, thousands of users — most of them spending more than three minutes per session — will bankrupt me in a week.

So four criteria: high fidelity, friendly, dirt-cheap, unique.

## High fidelity

Tackled this first. Ruled out a pile of mediocre approaches and landed on LightRAG — an open-source project out of universities in Beijing and Hong Kong, and frankly an epic piece of engineering.

Configuration at this point: visitor writes a message → LightRAG takes the question, uses gpt-4o-mini to expand it and match against the graph + vectors, returns ranked snippets with source URLs.

## Friendly

For this one I stepped away from the classic search bar entirely. Built a widget instead, called it Copilot, started prompting. The widget is just the frame — the actual friendliness has to come from the writer.

Configuration at this point: Copilot takes the snippets and asks Claude Sonnet 4.6 to draft the answer in our voice — with OpenAI's gpt-4.1 as fallback.

Total models in play: gpt-4o-mini (LightRAG's brain, index + query), text-embedding-3-small (vectors), Sonnet 4.6 (the writer). No Opus.

## Dirt-cheap

That model list above is the entire paid surface. LightRAG runs locally, the embeddings cost almost nothing, the retrieval pass doesn't bill at all — the only place the meter runs is the final Sonnet call. Cents a day across hundreds of pages and three languages.

## Unique

At this point I had a high-fidelity search that talked back like a regular LLM chatbot. Which was fine, except the "regular" part went directly against my unique criterion. So I made two more moves.

The first move was a second indexing pass. The first pass had fed Copilot the article-style content. The second added a structured snapshot of every landing page on the site — every heading, every CTA, every paragraph, with a short text anchor for each. That gave Copilot two new powers at once. It now knows where the visitor is on the site. And when it recommends something that's also linked on the current page, it can light up the exact element — using the anchors stored on the server plus a live read of the page in the visitor's browser. Headings and CTAs are just text, so the indexing was trivial; the navigation feel is what changed. Copilot now gently nudges visitors toward the exact part of the page they should be clicking.

The second move sits on top of LightRAG, not inside it. I wanted theme-based clusters across keepsimple — small orbits of related material — and a rule that, once we know what a visitor is reading, keeps their suggestions inside that orbit. So between LightRAG's snippets and the writer call, I added a thin server-side step that re-weights what comes back based on the visitor's page. A UX Core reader gets more UX Core. An AI Atlas reader gets more AI. Same logic as a social feed weighted toward your interests: when we know where you are, we keep you there.

These two moves gave Copilot real character, specific to this site, at no extra cost.

That's how I ended up building a thingy that closed my gestalt — a search bar that's none of the things I hated about search bars, and one I actually use.

Next: the orbit logic up close — how the cluster weights actually move, and what makes a cluster a cluster.

Stay safe. Learn and grow with us. Thanks.

Wolf Alexanyan, Armenia, May 2026.

```
Visitor question + current page
        ↓
LightRAG  (gpt-4o-mini)
  expands the question
  matches against graph + vectors
        ↓
Ranked snippets + source URLs
        ↓
Orbit reweighting
  reorders snippets and pointer cards
  toward the visitor's current page
        ↓
Copilot widget server
  assembles the prompt
  attaches page identity + history
        ↓
Sonnet 4.6  (gpt-4.1 fallback)
  drafts the reply in our voice
  picks 2-3 pointer cards
        ↓
Reply + cards + on-page highlights
        ↓
Back to visitor
```
