# Library MCP

Five tools an agent can hold, on one library, through one key.

The Library backend already does everything this needs: a tag has a name, a
description, a colour and its own order of books; a book has a note, a rating
and a difficulty. What was missing was a key a machine may hold and a wrapper
that reads as tools. This is both.

## The tools

| Tool                | What it does                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `library_books`     | Every book with its note, rating, shelf and tags. Narrow by title, tag or shelf. Everything else takes the titles and ids this returns.  |
| `library_tag`       | Create a tag, or change its name, colour or description.                                                                                 |
| `library_tag_books` | Put a tag on books, or take it off.                                                                                                      |
| `library_tag_order` | Set the order the tag's books stand in. A partial list is enough: what is named takes the front, the rest keep their sequence behind it. |
| `library_book`      | Change a book's note, rating or difficulty.                                                                                              |

Books and tags are named the way a person names them, by title or by word. A
name that matches two books is refused with both candidates rather than
guessed at. Nothing here deletes a book, a shelf or a tag: those ask the owner
first, in the Library, and they stay there.

## What the key is

Every Library controller decides who may write by reading the authenticated
user, so an API token, which carries no user, cannot write here at all. The
key is exchanged at `POST /api/auth/library-agent/session` for the ordinary
session that library's owner holds, valid two hours. Nothing downstream is
relaxed: the same ownership checks, the same feature flag and the same limits
decide every write, and a call that would touch another library fails in this
wrapper before it is sent.

Keys live in the CMS as `LIBRARY_AGENT_KEYS=<label>:<sha256>:<library id>`,
comma separated. Only the digest is held there, so that configuration leaking
hands nobody a session. Write one with:

```
node mcp/library/keygen.mjs arc 2
```

The key goes into a file the holding agent reads; the digest line goes to The
Order, who sets it on the CMS the target names.

## Wiring it to an agent

```json
{
  "mcpServers": {
    "keepsimple-library": {
      "command": "node",
      "args": ["/workspace/keepsimple/mcp/library/server.mjs"],
      "env": {
        "KS_LIBRARY_TARGET": "prod",
        "KS_LIBRARY_AGENT_KEY_FILE": "/data/secrets/keepsimple-library-agent-key"
      }
    }
  }
}
```

| Variable                    | Meaning                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `KS_LIBRARY_TARGET`         | `prod` or `staging`. The two databases number their libraries separately, so a key belongs to one of them, never both. |
| `KS_LIBRARY_AGENT_KEY_FILE` | Where the key is read from. Defaults to `/data/secrets/keepsimple-library-agent-key`.                                  |
| `KS_LIBRARY_AGENT_KEY`      | The key itself, when a file is not wanted.                                                                             |
| `KS_LIBRARY_STRAPI`         | A CMS address, overriding the target's own.                                                                            |
| `KS_LIBRARY_JOURNAL`        | Where the trail is written. Defaults to `logs/library-mcp.jsonl` in this checkout.                                     |

Every call leaves one line in the journal: the tool, its arguments, the
outcome and how long it took, in UTC. Long text is cut to a hundred and twenty
characters, so the trail says which book was reached without copying the
library into a log. The key and the session never appear in it.

## Proving it works

```
KS_LIBRARY_TARGET=staging \
KS_LIBRARY_SESSION_JWT=<a session for the owner> KS_LIBRARY_ID=<library> \
node mcp/library/probe.mjs
```

The probe runs all five tools against a live library and takes back every
write it makes: the tag it creates it deletes, the note it changes it
restores, and it re-reads independently to prove each one landed. Point it at
a library whose contents you are willing to have touched.

`KS_LIBRARY_SESSION_JWT` with `KS_LIBRARY_ID` skips the key exchange and uses
a session handed in. It grants nothing on its own, since the CMS still has to
accept the token; it exists so the tools can be exercised before the key
endpoint is deployed.

The CMS side has its own probe, which needs no database:

```
node src/extensions/users-permissions/controllers/library-agent.probe.js
```
