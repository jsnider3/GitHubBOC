app.controller('MainController', 
               ['$scope', '$http', function($scope, $http) {
                  $scope.github = "https://api.github.com",
                  $scope.main = function (username) {
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
                    repos = links.map(function (link) {
                      return link.split("/")[1];
                    });
                    var count = links.length;
                    var progmaps = {};
                    links.forEach(function (link) {
                      //For each repo.
                      //var langUrl = $scope.github + "/repos/" + link + "/languages"
                      var reponame = link.split("/")[1] 
                      var langUrl = "./" + link + ".json"
                      $http.get(langUrl).then(function(resp) {
                        var langs = resp.data
                        console.log(langs)
                        count--;
                        if (Object.keys(langs).length > 0) {
                          //Keep track of how much code was written in each language.
                          Object.keys(langs).forEach(function (lang) {
                            if (lang in progmaps) {
                            } else {
                              progmaps[lang] = []
                            }
                            progmaps[lang].push({name: reponame, value: langs[lang]})
                          });
                        }
                        if (count == 0) {
                          console.log(progmaps)
                          var order = Object.keys(progmaps).sort(function (a, b) {
                            var sum = function(lang) {
                              var cnt = 0
                              progmaps[lang].forEach( function(repo) {
                                cnt += repo.value
                              })
                              return cnt 
                            }
                            return sum(b) - sum(a);
                          }); 
                          /*var chartData = {}
                          Object.keys(progmaps).forEach( function(lang) {
                            Object.keys(progmaps[lang)
                          })*/
                          Object.keys(progmaps).forEach(function(lang) {
                            repos.forEach(function(repo) {
                              var found = false
                              progmaps[lang].forEach(function(elem) {
                                if (elem.name === repo) {
                                  found = true
                                }
                              })
                              if (!found) {
                                progmaps[lang].push({name: repo, value: 0})
                              }
                            })
                            progmaps[lang].sort()
                          })
                          $scope.makeChart(order, progmaps);
                        }
                      });
                    });
                  },
                  
                  $scope.makeChart = function(order, data) {
                    console.log("Chartify!")
                    console.log("Order")
                    console.log(order)
                    console.log("Data")
                    console.log(JSON.stringify(data));
                    var graphdef = {
                      categories : order,//['C++', 'TeX'],
                      dataset : data/*{
                        'C++' : [
                          { name : 'workspace', value : 32 },
                          { name : 'study', value : 60 },
                          { name : '2011', value : 97 },
                          { name : '2012', value : 560 },
                          { name : '2013', value : 999 }
                        ],
                        'TeX' : [
                          { name : 'workspace', value : 999 },
                          { name : 'study', value : 97 },
                          { name : '2011', value : 560 },
                          { name : '2012', value : 60 },
                          { name : '2013', value : 32 },
                          { name : '2014', value : 32 }
                        ]
                      }*/
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
