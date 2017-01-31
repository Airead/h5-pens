var gameState = {
    /*
        into color: clear rgb and cname, generate new color to train
        into answer: keep last step rgb, and show the anwser of color
    */
    state: 'answer', // ['color', 'answer'], 
    rgb: '#eeeeee',
    cname: 'white'
};

var trainLevels = {
    '1': ['500'],
    '2': ['100', '500', '900'],
    '3': ['100', '300', '500', '700', '900'],
};

var trainColors = collectAllColors(['500']);

var mainContent = document.getElementById('main');
var answerContent = document.getElementById('answer');

document.onclick = next;

main();

function main() {
    var query = getQuery(location.search);
    var level = '1';
    if (query.level && trainLevels[query.level]) {
        level = query.level;
    }

    startTrain(level);
}

function getQuery(search) {
    if (search[0] == '?') {
        search = search.slice(1);
    }

    var query = {};

    var pairs = search.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var tmps = pairs[i].split('=');
        if (tmps[1]) {
            query[tmps[0]] = tmps[1];
        }
    }

    return query;
}

function startTrain(level) {
    trainColors = collectAllColors(trainLevels[level]);
}

function collectAllColors(types) {
    var cnames = Object.keys(colorDefs);

    var colors = {};
    for (var i = 0; i < cnames.length; i++) {
        var cname = cnames[i];

        var cs = collectOneColors(cname, types);
        extend(colors, cs);
    }

    return colors;
}

function collectOneColors(name, types) {
    var oneColors = {};
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var color = colorDefs[name][type];
        if (color) {
            oneColors[name + type] = color;
        }
    }

    return oneColors;
}

function extend(target, from) {
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (from[key]) {
            target[key] = from[key];
        }
    }
}

function next() {
    console.log('next', gameState);
    switch (gameState.state) {
        case 'color':
            gameState.state = 'answer';
            generateNewColor();
            break;
        case 'answer':
            gameState.state = 'color';
            showAnswer();
            break;
        default:
    }
}

function generateNewColor() {
    var colorObj = getRandomColorObj();
    console.log('get new colorObj', colorObj);

    gameState.cname = colorObj.name;
    gameState.rgb = colorObj.rgb;

    hideAnswer();
    showColor();
}

function getRandomColorObj() {
    var cnames = Object.keys(trainColors);
    var name = cnames[randInt(0, cnames.length)];
    return {
        name: name,
        rgb: trainColors[name]
    };
}

function randInt(lo, hi) {
    return parseInt(Math.random() * (hi - lo)) + lo;
}

function showColor() {
    document.body.style.background = gameState.rgb;
}

function showAnswer() {
    answerContent.innerHTML = gameState.cname;
}

function hideAnswer() {
    answerContent.innerHTML = '';
}