/**
 * data foramt
 *
 */

var dataDemo = {
    javascript: {
        title: 'JavaScript',
        exercises: [{
            type: 'task', //task or think(独立思考)
            name: '任务简述',
            detail: '任务细节',
            cost: 10, // 花费分钟数
            date: '2017/04/18',
        }, {
            type: 'task', //task or think(独立思考)
            name: '任务简述',
            detail: '任务细节',
            cost: 20, // 花费分钟数
            date: '2017/04/17',
        }, {
            type: 'think',
            name: '思考标题1',
            link: 'http://www.baidu.com',
            date: '2017/04/16',
        }, {
            type: 'task', //task or think(独立思考)
            name: '任务简述',
            detail: '任务细节',
            cost: 35, // 花费分钟数
            date: '2017/04/19',
        }, {
            type: 'think',
            name: '思考标题2',
            link: 'http://aireadfun.com',
            date: '2017/04/04',
        }]
    },
    javascript2: {
        title: 'Vue',
        exercises: [{
            type: 'task', //task or think(独立思考)
            name: '任务简述',
            detail: '任务细节',
            cost: 10, // 花费分钟数
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }, {
            type: 'think',
            name: '思考标题',
            link: '文章链接',
            date: '2017/04/04',
        }]
    }
};

// Vue filter
Vue.filter('showHour', function showHour(minutes) {
    console.log('into showHour');
    var hour = (minutes / 60);
    return hour.toFixed(1) + '小时';
});

var gua64Defs = {
    '0': [1, 1, 1, 1, 1, 1], // 乾
    '1': [0, 0, 0, 0, 0, 0], // 坤
    '2': [0, 1, 0, 0, 0, 1], // 屯
};

/**
 * 1. 收集整理信息
 *   1.1 收集
 *   1.2 整理出 时间列表，文章列表
 *   1.3 算出时间积累，文章积累
 * 2. 生成技能卡
 */

var app = null;
var dataOnline = {};
var skillNames = [
    'JavaScript',
    'Vue',
    'Vue2',
    '切身体验',
];

main();

function main() {
    getData(skillNames, function (err, data) {
        if (skillNames.length == 0) {
            return done(dataDemo);
        }
        console.log('get Data', data);
        formatData(data);
        console.log(data);

        app = new Vue({
            el: '#app',
            data: data,
            methods: {
                openYao: function (think) {
                    console.log('open think', think);
                    window.open(think.link);
                },
                mouseoverYao: function (think) {
                    console.log('mouse over', think.name);
                }
            }
        });
    });
}

function getData(names, done) {
    if (names.length === 0) {
        return done(null, dataDemo);
    }

    var data = {};
    eachSeries(names, function(name, cb) {
        request('skillContent/' + name + '.csv', function(err, text) {
            if (err) return done(err);
            data[name] = {
                title: name,
                exercises: [],
            };

            text = removeComments(text);
            console.log('text', text);
            var exs = d3.csvParse(text);

            parseExercise(exs);
            data[name].exercises = exs;

            cb(null, text);
        });
    }, function(err) {
        if (err) {
            console.log('request', name, err);
            return done(err);
        }

        return done(null, data);
    });

    function removeComments(text) {
        var lines = text.split('\n');
        lines = lines.filter(function(line) {
            return line[0] !== '#';
        });
        return lines.join('\n');
    }

    function parseExercise(exercises) {
        for (var i = 0; i < exercises.length; i++) {
            var e = exercises[i];
            e.cost = parseInt(e.cost);
        }
    }
}

// cb(null, ret)
function eachSeries(arr, iteratee, done) {
    next(arr, 0);

    function next(arr, i) {
        if (i < arr.length) {
            iteratee(arr[i], function(err) {
                if (err) {
                    return done(err);
                } else {
                    next(arr, i + 1);
                }
            });
        } else {
            done(null)
        }
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

function formatData(skillData) {
    var i;
    var skillNames = Object.keys(skillData);
    var skillList = [];
    for (i = 0; i < skillNames.length; i++) {
        skillList.push(skillData[skillNames[i]]);
    }

    for (i = 0; i < skillList.length; i++) {
        fillNeedComputeInfo(skillList[i]);
    }

    skillList.sort(function(a, b) {
        return b.thinks.length - a.thinks.length;
    });

    skillData.skillList = skillList;
}

function fillNeedComputeInfo(skillObj) {
    var i;
    var tasks = [];
    var lastUpdateTs = 0;
    var costSum = 0;
    var thinks = [];
    var exs = skillObj.exercises;

    for (i = 0; i < exs.length; i++) {
        var e = exs[i];
        if (e.type === 'task') {
            tasks.push(e);
        } else if (e.type === 'think') {
            thinks.push(e);
        }
    }

    // get last update date
    for (i = 0; i < exs.length; i++) {
        e = exs[i];
        costSum += (e.cost || 0);
        var ts = new Date(e.date).getTime();
        if (lastUpdateTs < ts) {
            lastUpdateTs = ts;
        }
    }

    skillObj.introLink = ['skillContent/', skillObj.title, '.md'].join('');
    skillObj.tasks = tasks;
    skillObj.thinks = thinks;
    skillObj.costSum = costSum;
    skillObj.lastUpdateDate = formatTimestamp(lastUpdateTs);
    skillObj.guas = getGuasFromThinks(thinks);
}

function getGuasFromThinks(thinks) {
    var i = 0;
    var j = 0;
    var level = thinks.length;
    var guaNum = Math.floor(level / 6);

    var guas = [];
    var guaTags = [];

    if (!gua64Defs[guaNum]) {
        return guas;
    }

    for (i = 0; i <= guaNum; i++) {
        guaTags.push(gua64Defs[i].slice(0));
    }

    var index = 0;
    for (i = 0; i < guaTags.length; i++) {
        var yaos = guaTags[i];
        var gua = [];
        for (j = yaos.length - 1; j >= 0; j--) {
            var think = thinks[index++] || {};
            think.yao = yaos[j];
            if (!think.type) {
                think.yao -= 2;
            }
            gua.push(think);
        }
        guas.push(gua.reverse());
    }

    return guas;
}

function formatTimestamp(ts) {
    var d = new Date(ts);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    return [year, month, date].join('/');
}