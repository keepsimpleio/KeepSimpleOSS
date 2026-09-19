// Libraries whose public books are offered as title suggestions to every
// member adding a book: the shared memory of the system, above Google Books
// and Open Library. Usernames, matched case-insensitively against the owner
// of each library in the public directory. Wolf's library only for now
// (Wolf, 2026-09-09); widening it to every public library is one entry here.
export const SHARED_LIBRARY_OWNERS = ['wolf'];

/** Most member matches returned per shared library on one query. */
export const SHARED_LIBRARY_MAX_MATCHES = 6;
