### Notes

$.getJSON("./repos.json") isn't aloowed when you're accessing the file
ith the "file://" protocol. I fixed this by installing lamp-server^ and
putting the files in /var/www/html.


