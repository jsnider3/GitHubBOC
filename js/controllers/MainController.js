app.controller('MainController', 
               ['$scope', '$http', function($scope, $http) {
                  $scope.github = "https://api.github.com",
                  $scope.main = function () {
                    var gitUrl = "./repos.json"
                    //var gitUrl = $scope.github + "/users/" + username + "/repos"
                    $http.get(gitUrl).then(function(resp) {
                      $scope.repoCallback(resp.data)
                    })
                  },

                  $scope.repoCallback = function(repos) {
                    var links = repos.map(function (repo) {
                      return repo.full_name;
                    });
                    document.getElementById('results').value = links.join();
                    var count = links.length;
                    var progmaps = {};
                    links.forEach(function (link) {
                      //For each repo.
                      //var langUrl = $scope.github + "/repos/" + link + "/languages"
                      var langUrl = "./" + link + ".json"
                      //console.log(langUrl)
                      $http.get(langUrl).then(function(resp) {
                        var langs = resp.data
                        console.log(langs)
                        count--;
                        if (Object.keys(langs).length > 0) {
                          //Keep track of how much code was written in each language.
                          //TODO Rewrite this garbage.
                          Object.keys(langs).forEach(function (k) {
                            if (k in progmaps) {
                              progmaps[k][link] = langs[k]//+= langs[k];
                            } else {
                              progmaps[k] = {}
                              progmaps[k][link] = langs[k];
                            }
                          });
                          
                          if (count == 0) {
                            var order = Objects.key(progmaps).sort(function (a, b) {
                              var sum = function(k) {
                                
                              }
                              return sum(b) - sum(a);
                            });
                            //Done, sort them, and return them.
                            /*var langs = Object.keys(progmaps).map(function (k) {
                              return {lang: k, bytes: progmaps[k]};
                            });
                            langs.sort(function(a, b) {
                              return b.bytes - a.bytes;
                            });*/
                            console.log("Order")
                            console.log(order)
                            console.log("Data")
                            console.log(progmaps);//langs);
                          }
                        }
                      });
                    });
                  };
                }])
