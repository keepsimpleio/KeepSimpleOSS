#!/bin/bash
# Proves the new Library tag model against the live staging Strapi.
# Fixtures: LibraryReview = user 1200, library 6. Books 24/25/26 on public
# shelves, video 27. Tags 8..12 belong to that account.
# Every write it makes is undone at the end.
B="https://staging-strapi.keepsimple.io"
JWT=$(node -e "console.log(require('/workspace/keepsimple/.dev-session.json').jwt)")
A=(-H "Authorization: Bearer $JWT" -H "Content-Type: application/json")
ok=0; bad=0
pass(){ echo "PASS  $1"; ok=$((ok+1)); }
fail(){ echo "FAIL  $1  << $2"; bad=$((bad+1)); }
tagsof(){ curl -sg "$B/api/objects/$1?populate[tags][fields][0]=name" "${A[@]}" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log((j.data.attributes.tags?.data??[]).map(t=>t.id).sort((a,b)=>a-b).join(','))}catch(e){console.log('ERR')}})"; }
seq_of(){ curl -sg "$B/api/tags?libraryId=6" "${A[@]}" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);const t=(j.data||[]).find(x=>x.id==$1);console.log(t?(t.attributes.objects||[]).join(','):'MISSING')}catch(e){console.log('ERR')}})"; }
anon_tags(){ curl -sg "$B/api/tags?libraryId=6" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log((j.data||[]).map(t=>t.id+':'+(t.attributes.objects||[]).join('|')).join(' '))}catch(e){console.log('ERR')}})"; }
code(){ curl -sg -o /dev/null -w '%{http_code}' "$@"; }

echo "=== 1. one tag on two books at once (the whole point) ==="
curl -sg -X PUT "$B/api/objects/24" "${A[@]}" -d '{"data":{"tags":[8]}}' -o /dev/null
curl -sg -X PUT "$B/api/objects/25" "${A[@]}" -d '{"data":{"tags":[8]}}' -o /dev/null
t24=$(tagsof 24); t25=$(tagsof 25)
[ "$t24" = "8" ] && [ "$t25" = "8" ] && pass "tag 8 sits on book 24 and book 25 together" \
  || fail "tag 8 did not hold on both books" "24=[$t24] 25=[$t25]"

echo "=== 2. the tag's own sequence saves and reads back ==="
before=$(seq_of 8)
curl -sg -X POST "$B/api/tags/reorder" "${A[@]}" -d '{"tagId":8,"objects":[{"id":25,"order":0},{"id":24,"order":1}]}' -o /dev/null
after1=$(seq_of 8)
curl -sg -X POST "$B/api/tags/reorder" "${A[@]}" -d '{"tagId":8,"objects":[{"id":24,"order":0},{"id":25,"order":1}]}' -o /dev/null
after2=$(seq_of 8)
[ "$after1" = "25,24" ] && [ "$after2" = "24,25" ] \
  && pass "sequence written and read back both ways (was [$before])" \
  || fail "sequence did not hold" "first=[$after1] second=[$after2]"

echo "=== 3. a partial list is refused ==="
c=$(code -X POST "$B/api/tags/reorder" "${A[@]}" -d '{"tagId":8,"objects":[{"id":24,"order":0}]}')
[ "$c" = "400" ] && pass "a list missing a book the tag carries is refused (400)" \
  || fail "a partial reorder was not refused" "http=$c"

echo "=== 4. tags label books only ==="
c=$(code -X PUT "$B/api/objects/27" "${A[@]}" -d '{"data":{"tags":[9]}}')
[ "$c" = "400" ] && pass "a video refuses a tag (400)" || fail "a video accepted a tag" "http=$c"

echo "=== 5. a visitor sees only public books, and no empty tag ==="
anon=$(anon_tags)
echo "      anonymous sees: $anon"
case "$anon" in *"8:"*) pass "the visitor is offered tag 8, which labels public books";; *) fail "tag 8 missing for a visitor" "$anon";; esac
case "$anon" in *"10:"*|*"11:"*|*"12:"*) fail "a tag labelling nothing was offered to a visitor" "$anon";; *) pass "tags labelling nothing are not offered to a visitor";; esac

echo "=== 6. names are unique per library, not across the platform ==="
c=$(code -X POST "$B/api/tags" "${A[@]}" -d "{\"data\":{\"name\":\"fav-book\",\"slug\":\"probe-$(date +%s)\",\"color\":\"#AF6A34\",\"library\":6,\"user\":1200,\"publishedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}}")
echo "      creating a name another account already owns -> http=$c"
[ "$c" = "200" ] && pass "a name held by another library is accepted" || fail "a name held elsewhere was still refused" "http=$c"

echo "=== 7. nobody edits a tag they do not own ==="
c=$(code -X PUT "$B/api/tags/1" "${A[@]}" -d '{"data":{"color":"#111111"}}')
[ "$c" = "403" ] && pass "another account's tag refuses the write (403)" || fail "another account's tag accepted a write" "http=$c"

echo
echo "--- restoring ---"
curl -sg -X PUT "$B/api/objects/24" "${A[@]}" -d '{"data":{"tags":[]}}' -o /dev/null
curl -sg -X PUT "$B/api/objects/25" "${A[@]}" -d '{"data":{"tags":[]}}' -o /dev/null
curl -sg -X PUT "$B/api/objects/26" "${A[@]}" -d '{"data":{"tags":[8,9]}}' -o /dev/null
echo "      book 24 tags: [$(tagsof 24)]  book 25 tags: [$(tagsof 25)]  book 26 tags: [$(tagsof 26)]"
echo
echo "RESULT  $ok passed, $bad failed"
