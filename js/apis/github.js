
(function() {
  var data, cls, get, getNext, init, jsonp, make, makeWidget, text,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;


  makeWidget = function(data, div) {
    var user, opts, srtdDataLen, repoNames, sortBy, srtdData, repos, repoNm, repo;

    user = div.getAttribute('data-user');

    opts = div.getAttribute('data-options');
    opts = typeof opts === 'string' ? JSON.parse(opts) : {};

    repoNames = (user + ".github.com");
    repos = [];

    sortBy = opts.sortBy || 'repo.names';
    srtdData = data.sort(function(a, b) {
      return b[sortBy] - a[sortBy];
    });

    for (var a = 0, srtdDataLen = srtdData.length; a < srtdDataLen; a++) {
      repo = srtdData[a];

      if ((repoNm = repo.name, indexOf.call(repoNames, repoNm) >= 0) || !repo.description) {
        continue;
      }

      
      /*defining parent and child classes for displaying through html*/
      repos.push(make({
        parent: div,
        cls: 'gw-bx-outer',
        kids: [
          make({
            cls: 'gw-bx',
            kids: [
              make({
                cls: 'gw-title',
                kids: [
                  make({
                    tag: 'h2',
                    tag: 'a',
                    href: repo.html_url,
                    text: repo.name,
                    cls: 'gw-name'
                  })
                ]
              }), 
              repo.language != null ? make({
                cls: 'gw-repo-lang',
                text: repo.language
              }) 
              : void 0, make({
                cls: 'gw-repo-desc',
                tag: 'p',
                text: repo.description
              })
            ]
          })
        ]
      }));
    }
    return repos;
  };


  /*array declared to put data retrieved from github that will actually be displayed on the website*/
  data = [];

  init = function() {
    var gwRef, repos, i, j, len, div;
    gwRef = get({
      tag: 'div',
      cls: 'github-widget'
    });
    repos = [];
    for (i = j = 0, len = gwRef.length; j < len; i = ++j) {
      div = gwRef[i];
      repos.push((function(div, i) {
        data.push([]);
        return getNext("https://api.github.com/users/" + (div.getAttribute('data-user')) + "/repos?callback=<cb>", div, i);
      })(div, i));
    }
    return repos;
  };


  getNext = function(url, div, seq) {
    return jsonp({
      url: url,
      /*when data is successfully read from github and organized into array*/
      success: function(payload) {

        /*links are created to link back to repositories loaded into the array*/
        var j, len, link, links;
        data[seq] = data[seq].concat(payload.data);
        links = payload.meta.Link;
        
        if (links) {
          /*traverse through each repo to assign the link of each repository correctly*/
          for (j = 0, len = links.length; j < len; j++) {
            link = links[j];
            if (link[1].rel === 'next') {
              getNext(link[0], div, seq);
              return;
            }
          }
        }
        return makeWidget(data[seq], div);
      }
    });
  };


  /*function to create and add classes to html*/
  cls = function(el, opts) {
    var classHash, classes, hasClasses, c, j, l, len, len1, ref;
    if (opts == null) {
      opts = {};
    }
    classHash = {};
    classes = el.className.match(cls.re);
    if (classes != null) {
      for (j = 0, len = classes.length; j < len; j++) {
        c = classes[j];
        classHash[c] = true;
      }
    }
    hasClasses = (ref = opts.has) != null ? ref.match(cls.re) : void 0;
    if (hasClasses != null) {
      for (l = 0, len1 = hasClasses.length; l < len1; l++) {
        c = hasClasses[l];
        if (!classHash[c]) {
          return false;
        }
      }
      return true;
    }
    return null;
  };


  cls.re = /\S+/g;

  get = function(opts) {
    var el, els, hasCls, inside, ref, ref1, ref2, ref3, tag;
    if (opts == null) {
      opts = {};
    }
    inside = (ref = opts.inside) != null ? ref : document;
    tag = (ref1 = opts.tag) != null ? ref1 : '*';
    if (opts.id != null) {
      return inside.getElementById(opts.id);
    }
    hasCls = opts.cls != null;
    if (hasCls && tag === '*' && (inside.getElementsByClassName != null)) {
      return inside.getElementsByClassName(opts.cls);
    }
    els = inside.getElementsByTagName(tag);
    if (hasCls) {
      els = (function() {
        var j, len, repos;
        repos = [];
        for (j = 0, len = els.length; j < len; j++) {
          el = els[j];
          if (cls(el, {
            has: opts.cls
          })) {
            repos.push(el);
          }
        }
        return repos;
      })();
    }
    if ((opts.multi == null) && (ref2 = tag.toLowerCase(), indexOf.call(get.uniqueTags, ref2) >= 0)) {
      return (ref3 = els[0]) != null ? ref3 : null;
    } else {
      return els;
    }
  };


  get.uniqueTags = 'html body frameset head title base'.split(' ');

  text = function(t) {
    return document.createTextNode('' + t);
  };


  make = function(opts) {
    var c, j, k, len, ref, t, v;
    if (opts == null) {
      opts = {};
    }
    t = document.createElement((ref = opts.tag) != null ? ref : 'div');
    for (k in opts) {
      if (!hasProp.call(opts, k)) continue;
      v = opts[k];
      switch (k) {
        case 'tag':
          continue;
        case 'parent':
          v.appendChild(t);
          break;
        case 'kids':
          for (j = 0, len = v.length; j < len; j++) {
            c = v[j];
            if (c != null) {
              t.appendChild(c);
            }
          }
          break;
        case 'prevSib':
          v.parentNode.insertBefore(t, v.nextSibling);
          break;
        case 'text':
          t.appendChild(text(v));
          break;
        case 'cls':
          t.className = v;
          break;
        default:
          t[k] = v;
      }
    }
    return t;
  };
  

  jsonp = function(opts) {
    var callbackName, ref, ref1, url;
    callbackName = (ref = opts.callback) != null ? ref : '_JSONPCallback_' + jsonp.callbackNum++;
    url = opts.url.replace('<cb>', callbackName);
    window[callbackName] = (ref1 = opts.success) != null ? ref1 : jsonp.noop;
    return make({
      tag: 'script',
      src: url,
      parent: get({
        tag: 'head'
      })
    });
  };

  jsonp.callbackNum = 0;

  jsonp.noop = function() {};

  init();

}).call(this);