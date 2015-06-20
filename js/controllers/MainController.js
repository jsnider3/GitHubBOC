app.controller('MainController', 
               ['$scope', '$http', function($scope, $http) {
                  $scope.github = "https://api.github.com",
                  $scope.main = function () {
                    var username = document.getElementById("user").value
                    var gitUrl = $scope.github + "/users/" + username + "/repos"
                    gitUrl = "./repos.json"
                    console.log(gitUrl)
                    $http.get(gitUrl).then(function(resp) {
                      $scope.repoCallback(resp.data)
                    })
                  },
                  $scope.findNamed = function(arr, name) {
                    var result = undefined
                    arr.forEach(function(elem) {
                      if (elem.name == name) {
                        result = elem
                      }
                    })
                    return result
                  },
                  $scope.repoCallback = function(repos) {
                    console.log(repos)
                    var links = repos.map(function (repo) {
                      return repo.full_name;
                    });
                    repos = links.map(function (link) {
                      return link.split("/")[1];
                    });
                    var count = links.length;
                    var progmaps = {};
                    var langSet = []
                    links.forEach(function (link) {
                      //For each repo.
                      var langUrl = $scope.github + "/repos/" + link + "/languages"
                      var reponame = link.split("/")[1] 
                      langUrl = "./" + link + ".json"
                      $http.get(langUrl).then(function(langs) {
                        var langs = langs.data
                        count--;
                        if (Object.keys(langs).length > 0) {
                          //Keep track of how much code was written in each language.
                          Object.keys(langs).forEach(function (lang) {
                            if (!progmaps.hasOwnProperty(reponame)) {
                              progmaps[reponame] = []
                            }
                            progmaps[reponame].push({name: lang, value: langs[lang]})
                            langSet.push(lang)
                          });
                        }
                        if (count == 0) {
                          function onlyUnique(value, index, self) {
                            return self.indexOf(value) === index;
                          }
                          repos = repos.filter(onlyUnique)
                          langSet = langSet.filter(onlyUnique)

                          $scope.sortLangs(progmaps, langSet)
                          Object.keys(progmaps).forEach(function(reponame) {
                            langSet.forEach(function(lingua) {
                              var found = $scope.findNamed(progmaps[reponame], lingua)
                              if (found == undefined) {
                                progmaps[reponame].push({name: lingua, value: 0})
                              }
                            })
                            progmaps[reponame].sort(function (a, b) {
                              return langSet.indexOf(b.name) - langSet.indexOf(a.name)
                            })
                          })
                          $scope.makeChart(repos, progmaps);
                        }
                      });
                    });
                  },

                  $scope.sortLangs = function(repos, langs) {
                    langs = langs.sort(function (a, b) {
                      var sum = function(lang) {
                        var cnt = 0
                        Object.keys(repos).forEach( function(reponame) {
                          var search = $scope.findNamed(repos[reponame], lang)
                          if (search != undefined) {
                            cnt += search.value
                          }
                        })
                        return cnt
                      }
                      return sum(a) - sum(b);
                    });
                  },

                  $scope.makeChart = function(order, data) {
                    var graphdef = {
                      categories : order,
                      dataset : data
                    }
                    var chart = uv.chart('StackedBar', graphdef, {
                      meta: {
                        caption: 'Your Most Used Languages',
                        subcaption: 'sorted by repo',
                        hlabel: 'Size',
                        hsublabel: 'Bytes',
                        vlabel: 'Languages'
                      },
                      dimension: {
                        width: 600,
                        height: 600
                      }
                    });
                  }
                }])
