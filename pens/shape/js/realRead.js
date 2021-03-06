var content = '';
var contentInfo = {};
var pageLineNum = 23;
var lineFontNum = 39;
var glanceFontNum = 13;
var glanceLineNum = 1;
var fontSize = 16;
var showLine = 0;
var traintimer = null;
var tick = 330;
var txtSrc = null;

var curState = {
    line: 0,
    glance: 0,
    glanceLine: 0
};

main();

function main() {
    var query = getQuery();
    console.log('get query', query);
    updateByQuery(query);

    if (!txtSrc) {
        content = genContent();
        contentInfo = foramtContent(content);
        showContentInfo(showLine);
    } else {
        request(txtSrc, function (err, txt) {
            content = txt;
            contentInfo = foramtContent(content);
            showContentInfo(showLine);
        });
    }

    document.getElementById('page').addEventListener('click', function () {
        console.log("click");
        if (traintimer) {
            clearTimeout(traintimer);
            traintimer = null;
        } else {
            startTrain();
        }
    });
}

function getQuery() {
    var query = {};
    var hash = location.hash.slice(1);
    hash.split('&').forEach(function (kv) {
        var tmps = kv.split('=');
        if (tmps[1]) {
            query[tmps[0]] = tmps[1];
        }
    });

    return query;
}

function updateByQuery(query) {
    if (query.txtSrc) {
        txtSrc = decodeURIComponent(query.txtSrc);
    }
    if (query.pageLineNum) {
        pageLineNum = parseInt(query.pageLineNum) || 23;
    }
    if (query.lineFontNum) {
        lineFontNum = parseInt(query.lineFontNum) || 39;
    }
    if (query.glanceFontNum) {
        glanceFontNum = parseInt(query.glanceFontNum) || 13;
    }
    if (query.showLine) {
        showLine = parseInt(query.showLine) || 0;
    }
    if (query.tick) {
        tick = parseInt(query.tick) || 330;
    }
}

function genContent() {
    var content = [];
    var paragraphNum = 20;
    for (var i = 0; i < paragraphNum; i++) {
        content.push(genLine(56));
    }

    return content.join('');
}

function genLine(num) {
    var chars = [];
    for (var i = 0; i < num; i++) {
        chars.push(i % 10);
    }

    return chars.join('') + '\n';
}

function foramtContent(content) {
    var info = {};
    var originLines = content.split('\n');
    info.lines = originLines.map(function (oline) {
        return formatContentGetLines(oline, lineFontNum);
    });
    info.lines = flatArray(info.lines);
    info.lines = info.lines.filter(function(line) {return line;});

    info.glances = info.lines.map(function (line) {
        return formatContentGetGlances(line, glanceFontNum);
    });

    appendLessTail(info.glances);

    info.pageNum = Math.ceil(info.glances.length / pageLineNum);

    return info;
}

function formatContentGetLines(originLine, num) {
    return splitArray(originLine, num);
}

function splitArray(arr, num) {
    var res = [];
    while (arr.length > num) {
        res.push(arr.slice(0, num));
        arr = arr.slice(num);
    }
    res.push(arr);

    return res;
}

function formatContentGetGlances(line, num) {
    return splitArray(line, num);
}

function appendLessTail(glances) {
    for (var i = 0; i < glances.length; i++) {
        var g = glances[i];
        if (g.length < 2) {
            continue;
        }
        var lastG = g[g.length - 1];
        if (lastG.length < 4) {
            g[g.length - 2] += lastG;
            g.splice(g.length - 1, 1);
        }
    }
}

function flatArray(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (Object.prototype.toString.call(arr[i]) === '[object Array]') {
            res = res.concat(arr[i]);
        } else {
            res.push(arr[i]);
        }
    }

    return res;
}

function showContentInfo(showLine) {
    var lineIndex = document.getElementById('line-index');
    lineIndex.innerHTML = [showLine, contentInfo.glances.length].join('/');

    var page = document.getElementById('page');
    page.style.width = (fontSize * lineFontNum) + 'px';
    page.style.height = (fontSize * pageLineNum * 1.3) + 'px';

    page.innerHTML = '';

    var showLines = contentInfo.glances.slice(showLine, showLine + pageLineNum);
    for (var i = 0; i < showLines.length; i++) {
        var glances = showLines[i];
        var line = document.createElement('div');
        line.classList.add('text-line', 'text-line-' + i);
        line.style.left = 0;
        line.style.top = (fontSize * i * 1.3) + 'px';

        for (var j = 0; j < glances.length; j++) {
            var chars = glances[j].split('');
            var glance = document.createElement('div');
            glance.classList.add('text-glance', 'text-glance-' + j);
            glance.style.left = (j * glanceFontNum * fontSize) + 'px';
            glance.style.top = 0;

            for (var k = 0; k < chars.length; k++) {
                var text = document.createElement('span');
                text.innerHTML = chars[k];
                text.style.width = fontSize + 'px';
                text.style.height = fontSize + 'px';
                text.style.left = (fontSize * k) + 'px';
                text.style.top = 0;
                glance.appendChild(text);
            }

            line.appendChild(glance);
        }
        page.appendChild(line);
    }
}

function startTrain() {
    next(function (err, showLine) {
        console.log('next done', showLine);
        traintimer = setTimeout(function () {
            if (showLine) {
                stopTrain();
                showContentInfo(showLine);
                setTimeout(function () {
                    startTrain();
                }, tick);
            } else {
                startTrain();
            }
        }, tick);
    });
}

function stopTrain() {
    clearTimeout(traintimer);
    traintimer = null;
}

function next(done) {
    clearGlanceActive();
    var activeLine = '.text-line-' + curState.line;
    var activeGlance = '.text-glance-' + curState.glance;
    var selector = [activeLine, activeGlance].join(' ');
    var activeNodes = document.querySelectorAll(selector);

    glanceLineNum = Math.ceil(glanceFontNum / lineFontNum);
    console.log("curState", curState, showLine);
    if (glanceLineNum < 2) {
        for (var i = 0; i < activeNodes.length; i++) {
            activeNodes[i].classList.add('text-active');
        }

        curState.glance += 1;
        if (curState.glance >= contentInfo.glances[showLine + curState.line].length) {
            curState.glance = 0;
            curState.line += 1;

            if (curState.line >= contentInfo.glances.length || curState.line % pageLineNum === 0) {
                curState.line = 0;
                showLine += pageLineNum;
                return done && done(null, showLine);
            }
        }
    } else {
        activeLine = [];
        for (var j = 0; j < glanceLineNum; j++) {
            activeLine.push('.text-line-' + (curState.glanceLine + j));
        }

        selector = activeLine;
        activeNodes = document.querySelectorAll(selector);

        for (var k = 0; k < activeNodes.length; k++) {
            activeNodes[k].classList.add('text-active');
        }

        curState.glanceLine += glanceLineNum;
        if (curState.glanceLine >= pageLineNum) {
            curState.glanceLine = 0;
            showLine += pageLineNum;
            return done && done(null, showLine);
        }
    }


    return done && done();
}


function clearGlanceActive() {
    var nodes = document.querySelectorAll('.text-active');
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove('text-active');
    }
}

function request(url, done) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', url);
    httpRequest.send(null);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                done(null, httpRequest.responseText);
            } else {
                console('There was a problem with the request.');
                done(httpRequest.status);
            }
        }
    };
}