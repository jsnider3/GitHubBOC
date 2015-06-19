### Notes

`$.getJSON("./repos.json")` isn't allowed when you're accessing the file
ith the "file://" protocol. I fixed this by installing lamp-server^ and
putting the files in /var/www/html.

What's the difference between `success` vs `then` for `$http.get`?
I think `success` / `failure` are asynchronous and `then` / `catch` are
synchronous.




