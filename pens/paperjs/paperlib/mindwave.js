/*
Mind Wave Lib

# Mind Wave
Data Define \g Language Define \h 联接线索(9为极) /p 解析 language \o draw(paperjs)

## Data Define
wave = {
    id: 2,
    type: wavetype // -(null), /(up), \(down)
    keyword: keyword,
    detail: detail,
    parentId: id1
    next: id3
}

## Language Define
see [Mind Wave](#Mind Wave)

## 联接线索
\n when 时间
\e where 地点
\o who 人类
\g what 事物
\h which 层次
\y why 原因
\l law 规律
\d data 数据
\p practice 实践
### 虚线索
link

## 解析 language
global_waves = [wave1, wave2, ...]
global_wave_by_id = {id1: wave, id2: wave, id3: wave, ...}
global_wave_by_keyword = {keyword1: [wave1], keyworkd2: [wave2, wave3], ...}

## test
node -i -e "WaveManager = require('./mindwave').WaveManager; wm = new WaveManager(); wm.test()"

## draw
draw \p layoutWaves \p layoutWave \p drawWaves \p drawWave
*/

var mindWaveDesign = [
    "Data Define \\g Language Define \\h 联接线索(9为极) /p 解析 language \\o draw(paperjs)",
    "联接线索 \\h when(n) \\h where(e) \\h who(o)"
].join('\n')
var conjunctionRegexp = new RegExp('\\\\[neoghyldp]|\/[neoghyldp]', 'g')
var keywordAndDetailRegexp = new RegExp('(.*)\\((.*)\\)')

function WaveManager(scope, options) {
    this.wave_id = 1
    this.waves = []
    this.waves_by_id = {}
    this.waves_by_keyword = {}
    this.scope = scope
    this.options = options || { dy: 21, fontSize: 14, margin: 16, radius: 3, }
}

/*
parseMindWaveLanguage \p parseLine \p subwords \p word \p parseWord /h newWave
newWave /d test
parseMindWaveLanguage /h reset
*/
WaveManager.prototype.parseMindWaveLanguage = function (mvstr) {
    console.log('parseMindWaveLanguage', mvstr)
    this.reset()
    var lines = mvstr.split('\n')
    for (var i = 0; i < lines.length; i++) {
        this.parseLine(lines[i])
    }
}

WaveManager.prototype.reset = function() {
    this.wave_id = 1
    this.waves = []
    this.waves_by_id = {}
    this.waves_by_keyword = {}
}

WaveManager.prototype.parseLine = function (line) {
    console.log('parseLine', line)
    self = this
    var i
    var subwords = line.split(' ').map(function (x) { return x.trim() })
    console.log('subwords', subwords)
    var isHeadWord = true
    var type = '-'
    var last_word_is_conjunction = true // 不支持两个连词连续出现
    var word_slice = []
    for (i = 0; i < subwords.length; i++) {
        console.log('subword', subwords[i])
        if (subwords[i].match(conjunctionRegexp)) {
            console.log('hit conjunction', subwords[i])
            if (last_word_is_conjunction) {
                word_slice.push(subwords[i] + ' 解析出错了，亲！')
                break
            }
            if (word_slice) handlerWord(word_slice.join(' '))
            last_word_is_conjunction = true
            type = subwords[i]
        } else {
            console.log('hit shi word', subwords[i])
            last_word_is_conjunction = false
            word_slice.push(subwords[i])
        }
    }
    if (word_slice) handlerWord(word_slice.join(' '))

    function handlerWord(oneword) {
        word_slice = []
        console.log('harndlerWord', oneword)
        var word_info = self.parseWord(oneword)
        var parentId = self.wave_id - 1
        if (isHeadWord) {
            isHeadWord = false
            if (self.waves_by_keyword[word_info.keyword]) {
                parentId = self.waves_by_keyword[word_info.keyword][0].id
                type = 'link'
            }
        }
        self.newWave(type, word_info.keyword, word_info.detail, parentId)
    }
}

WaveManager.prototype.parseWord = function (word) {
    var word_info = {}
    var match = word.match(keywordAndDetailRegexp)
    if (match) {
        word_info.keyword = match[1]
        word_info.detail = match[2]
    } else {
        word_info.keyword = word
        word_info.detail = ''
    }
    return word_info
}

WaveManager.prototype.newWave = function (type, keyword, detail, parentId) {
    console.log('newWave', Array.prototype.slice.call(arguments))
    var wave = {
        id: this.wave_id++,
        type: type,
        keyword: keyword,
        detail: detail,
        parentId: parentId,
    }
    this.waves.push(wave)
    this.waves_by_id[wave.id] = wave
    if (!this.waves_by_keyword[wave.keyword]) {
        this.waves_by_keyword[wave.keyword] = []
    }
    this.waves_by_keyword[wave.keyword].unshift(wave)
}

WaveManager.prototype.test = function() {
    this.parseMindWaveLanguage(mindWaveDesign)
}

// options: dy, fontSize, margin, radius
// point: startP, secondP, endP, textCX, keywordP, detailP
WaveManager.prototype.layoutWave = function(startP, wave) {
    // startP = startP.add(options.radius, 0)
    var keywordItem = new this.scope.PointText({
        point: startP,
        content: wave.keyword,
        fillColor: 'black',
        fontSize: this.options.fontSize
    });
    var detailItem = new this.scope.PointText({
        point: startP.add(this.options.dy + this.options.margin/2, this.options.dy + this.options.fontSize),
        content: wave.detail,
        fillColor: 'black',
        fontSize: this.options.fontSize
    })
    var textWidth = Math.max(keywordItem.bounds.width, detailItem.bounds.width)
    keywordItem.remove()
    detailItem.remove()

    var secondP = startP.add(this.options.dy)
    var endP = secondP.add(this.options.margin + textWidth, 0)
    var textCx = endP.add((secondP.x - endP.x)/2, 0)
    var keywordP = textCx.add(-keywordItem.bounds.width*0.55, -this.options.margin/4)
    var detailP = textCx.add(-detailItem.bounds.width/2, this.options.fontSize)

    wave.gui = {
        startP: startP,
        secondP: secondP,
        endP: endP,
        textCx: textCx,
        keywordP: keywordP,
        detailP: detailP,
        options: this.options,
    }
    return wave.gui
}

WaveManager.prototype.drawWave = function(wave) {
    var g = wave.gui
    var path = new this.scope.Path([g.startP, g.secondP, g.endP])
    path.strokeColor = 'black'
    wave.circleItem = new this.scope.Path.Circle({
        center: g.startP,
        radius: g.options.radius,
        strokeColor: 'black',
        fillColor: 'white',
    })
    wave.keywordItem = new this.scope.PointText({
        point: g.keywordP,
        content: wave.keyword,
        fillColor: 'black',
        fontWeight: 'bold',
        fontSize: g.options.fontSize
    });
    wave.detailItem = new this.scope.PointText({
        point: g.detailP,
        content: wave.detail,
        fillColor: 'black',
        fontSize: g.options.fontSize
    })
}

WaveManager.prototype.layoutWaves = function(startPoint) {
    for (var i = 0; i < this.waves.length; i++) {
        this.layoutWave(startPoint, this.waves[i])
        startPoint = this.waves[i].gui.endP
    }
}

WaveManager.prototype.drawWaves = function() {
    for (var i = 0; i < this.waves.length; i++) {
        this.drawWave(this.waves[i])
    }
}

if (typeof exports !== 'undefined') {
    exports.WaveManager = WaveManager
    exports.mindWaveDesign = mindWaveDesign
}
