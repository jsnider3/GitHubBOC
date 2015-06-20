### Notes

`$.getJSON("./repos.json")` isn't allowed when you're accessing the file
ith the "file://" protocol. I fixed this by installing lamp-server^ and
putting the files in /var/www/html.

What's the difference between `success` vs `then` for `$http.get`?
I think `success` / `failure` are asynchronous and `then` / `catch` are
synchronous.

Ever look at some JavaScript file and see that it looks like line noise?
That's called "minification" and it's basically like compression except
it doesn't need to be undone for you to interpret it.
