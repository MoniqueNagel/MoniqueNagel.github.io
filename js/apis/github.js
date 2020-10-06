/** @preserve https://github.com/jawj/github-widget
Copyright (c) 2011 - 2012 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
*/

(function() {
  var allPayloadData, cls, get, getNext, init, jsonp, make, makeWidget, text,
  indexOf = [].indexOf || function(item) { 
    for (var i = 0, l = this.length; i < l; i++) { 
      if (i in this && this[i] === item) return i; 
    } 
    return -1; 
  },
  
  hasProp = {}.hasOwnProperty;
 
  makeWidget = function(payloadData, div) {

    var j, len, limit, made, options, ref, ref1, repo, results, siteRepoNames, sortBy, user;
    user = div.getAttribute('data-user');
    options = div.getAttribute('data-options');
    options = typeof options === 'string' ? JSON.parse(options) : {};
    siteRepoNames = [(user + ".github.com").toLowerCase(), (user + ".github.io").toLowerCase()];
    sortBy = options.sortBy || 'watchers';
    limit = parseInt(options.limit) || 2e308;
    made = 0;

    ref = payloadData.sort(function(a, b) {
      return b[sortBy] - a[sortBy];
    });


    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      repo = ref[j];

      if ((!options.forks && repo.fork) || (ref1 = repo.name.toLowerCase(), indexOf.call(siteRepoNames, ref1) >= 0) || !repo.description) {
        continue;
      }

      if (made++ === limit) {
        break;
      }

      results.push(make({
        parent: div,
        cls: 'gw-repo-outer',
        kids: [
          make({
            cls: 'gw-repo',
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
              }), repo.language != null ? make({
                cls: 'gw-lang',
                text: repo.language
              }) : void 0, make({
                cls: 'gw-repo-description',
                tag: 'p',
                text: repo.description
              })
            ]
          })
        ]
      }));
    }
    return results;
  };


  allPayloadData = [];


  init = function() {
    var div, i, j, len, ref, results;
    
    ref = get({
      tag: 'div',
      cls: 'github-widget'
    });

    results = [];

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      div = ref[i];
      results.push((function(div, i) {
        allPayloadData.push([]);
        return getNext("https://api.github.com/users/" + (div.getAttribute('data-user')) + "/repos?callback=<cb>", div, i);
      })(div, i));
    }
    return results;
  };


  getNext = function(url, div, seq) {

    return jsonp({
      url: url,
      success: function(payload) {

        var j, len, link, links;
        allPayloadData[seq] = allPayloadData[seq].concat(payload.data);
        links = payload.meta.Link;

        if (links) {
          for (j = 0, len = links.length; j < len; j++) {
            link = links[j];

            if (link[1].rel === 'next') {
              getNext(link[0], div, seq);
              return;
            }
          }
        }
        return makeWidget(allPayloadData[seq], div);
      }
    });
  };


  cls = function(element, options) {

    var c, classHash, classes, hasClasses, j, l, len, len1, ref;

    if (options == null) {
      options = {};
    }

    classHash = {};
    classes = element.className.match(cls.re);

    if (classes != null) {

      for (j = 0, len = classes.length; j < len; j++) {
        c = classes[j];
        classHash[c] = true;
      }
    }

    hasClasses = (ref = options.has) != null ? ref.match(cls.re) : void 0;

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

  get = function(options) {

    var element, elements, hasCls, inside, ref, ref1, ref2, ref3, tag;

    if (options == null) {
      options = {};
    }
    
    inside = (ref = options.inside) != null ? ref : document;
    tag = (ref1 = options.tag) != null ? ref1 : '*';

    if (options.id != null) {
      return inside.getElementById(options.id);
    }

    hasCls = options.cls != null;

    if (hasCls && tag === '*' && (inside.getElementsByClassName != null)) {
      return inside.getElementsByClassName(options.cls);
    }

    elements = inside.getElementsByTagName(tag);

    if (hasCls) {
      elements = (function() {
        var j, len, results;
        results = [];

        for (j = 0, len = elements.length; j < len; j++) {
          element = elements[j];

          if (cls(element, {has: options.cls})) {
            results.push(element);
          }
        }
        return results;
      })();
    }

    if ((options.multi == null) && (ref2 = tag.toLowerCase(), indexOf.call(get.uniqueTags, ref2) >= 0)) {
      return (ref3 = elements[0]) != null ? ref3 : null;
    } else {
      return elements;
    }
  };

  get.uniqueTags = 'html body frameset head title base'.split(' ');

  text = function(t) {
    return document.createTextNode('' + t);
  };

  make = function(options) {
    var c, j, k, len, ref, t, v;

    if (options == null) {
      options = {};
    }

    t = document.createElement((ref = options.tag) != null ? ref : 'div');

    for (k in options) {
      if (!hasProp.call(options, k)) continue;
      v = options[k];

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

    jsonp = function(options) {
      var callbackName, ref, ref1, url;
      callbackName = (ref = options.callback) != null ? ref : '_JSONPCallback_' + jsonp.callbackNum++;
      url = options.url.replace('<cb>', callbackName);
      window[callbackName] = (ref1 = options.success) != null ? ref1 : jsonp.noop;
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
