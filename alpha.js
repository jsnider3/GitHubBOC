"use strict";
var GitHubApi = require("github");
var http = require('http');
http.createServer(function (req, res) {
  if (req.url != "/favicon.ico") {
    var user = require('url').parse(req.url, true).query.user;
    if (typeof user === 'undefined') {
      //Default arg.
      user = "jsnider3"
    }
    console.log(user);
    res.writeHead(200);
    var github = new GitHubApi({
      version: "3.0.0",
      protocol: "https",
      host: "api.github.com",
      timeout: 5000,
      headers: {
        "user-agent": "node.js"
      }
    });
    github.authenticate({
      type: "basic",
      username: "jsnider3",
      password: redacted
    });
    github.repos.getFromUser({user: user}, function(err, resp) {
      var links = resp.map(function (repo) {
        return repo.full_name;
      });
      var count = links.length;
      var progmaps = {};
      links.map(function (link) {
        var arr = link.split("/");
        //For each repo.
        var opts = {user: arr[0], repo: arr[1]};
        github.repos.getLanguages(opts, function(err, resp) {
          delete resp.meta;
          if (Object.keys(resp).length == 0) {
            count = count - 1;
          } else {
            //Keep track of how much code was written in each language.
            Object.keys(resp).forEach(function (k) {
              if (k in progmaps) {
                progmaps[k] += resp[k];
              } else {
                progmaps[k] = resp[k];
              }
            });
            count = count - 1;
            if (count == 0) {
              //Done, sort them, and return them.
              var langs = Object.keys(progmaps).map(function (k) {
                return {lang: k, bytes: progmaps[k]};
              });
              langs.sort(function(a, b) {
                return b.bytes - a.bytes;
              });
              console.log(langs);
              res.end(JSON.stringify(langs));
            }
          }
        });
      });
    });
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
