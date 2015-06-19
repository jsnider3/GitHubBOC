app.controller('MainController', 
               ['$scope', '$http', function($scope, $http) {
                  $scope.github = "https://api.github.com",
                  $scope.makeRequest = function (url, callback) {
                    var request = new XMLHttpRequest();
                    request.onload = callback;
                    var username = document.getElementById('user');
                    request.open('get', url,
                      true);
                    //TODO FIXME
                    //request.setRequestHeader("User-Agent", "jsnider3");
                    return request
                  },

                  $scope.main = function () {
                    //var request = makeRequest(github + "/users/" + username + "/repos",
                    //                  repoCallback);
                    //request.send();
                    $scope.repoCallback();
                  },

                  $scope.repoCallback = function() {
                    $.getJSON("./repos.json", function (repos) {
                    var links = repos.map(function (repo) {
                      return repo.full_name;
                    });
                    document.getElementById('results').value = links.join();
                    var count = links.length;
                    var progmaps = {};
                    links.map(function (link) {
                      var langUrl = $scope.github + "/repos/" + link + "/languages"
                      var request = $scope.makeRequest(langUrl, undefined)
                      console.log(langUrl);
                      //For each repo.
                      $http.get(langUrl).then(function(resp) {console.log(resp.data)}).catch(function(foo) {});
                      /*delete resp.meta;
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
                          }
                        }
                        });*/
                      });
                    });
                  };
                }])
