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
    "联接线索 \\h when(n) \\h where(e) \\h who(o)",
    "联接线索 \\h thing(g) \\h which(h) \\h why(y)",
    "联接线索 \\h thing(g) \\h which(h) \\h why(y)",
    "联接线索 \\h thing(g) \\h which(h) \\h why(y)",
    "联接线索 /h thing(g) \\h which(h) \\h why(y)",
    "联接线索 /h thing(g) \\h which(h) \\h why(y)"
].join('\n')
var conjunctionRegexp = new RegExp('\\\\[neoghyldp]?|\/[neoghyldp]?', 'g')
var keywordAndDetailRegexp = new RegExp('(.*)\\((.*)\\)')

function WaveManager(scope, options) {
    this.wave_id = 1
    this.waves = []
    this.mindWaveCount = 0
    this.wavesById = {}
    this.wavesByKeyword = {}
    this.scope = scope
    this.options = options || {startPoint: new scope.Point(10, 100), dx: 21, dy: 21, fontSize: 14, margin: 16, radius: 3}
}

/*
parseMindWaveLanguage \p parseLine \p subwords \p word \p parseWord /h newWave
newWave /d test
parseMindWaveLanguage /h reset
*/
WaveManager.prototype.parseMindWaveLanguage = function (mvstr) {
    console.log('parseMindWaveLanguage', mvstr)
    this.reset()
    var lines = mvstr.split('\n').map(function(x) {return x.trim()})
    for (var i = 0; i < lines.length; i++) {
        if (lines[i]) {
            this.parseLine(lines[i])
        }
    }
}

WaveManager.prototype.reset = function() {
    this.wave_id = 1
    this.waves = []
    this.mindWaveCount = 0
    this.wavesById = {}
    this.wavesByKeyword = {}
}

WaveManager.prototype.parseLine = function (line) {
    // console.log('parseLine', line)
    self = this
    var i
    var subwords = line.split(' ').map(function (x) { return x.trim() })
    // console.log('subwords', subwords)
    var isHeadWord = true
    var type = '-'
    var last_word_is_conjunction = true // 不支持两个连词连续出现
    var word_slice = []
    for (i = 0; i < subwords.length; i++) {
        // console.log('subword', subwords[i])
        if (subwords[i].match(conjunctionRegexp)) {
            // console.log('hit conjunction', subwords[i])
            if (last_word_is_conjunction) {
                word_slice.push(subwords[i] + ' 解析出错了，亲！')
                break
            }
            if (word_slice) handlerWord(word_slice.join(' '))
            last_word_is_conjunction = true
            type = subwords[i]
        } else {
            // console.log('hit shi word', subwords[i])
            last_word_is_conjunction = false
            word_slice.push(subwords[i])
        }
    }
    if (word_slice) handlerWord(word_slice.join(' '))

    function handlerWord(oneword) {
        word_slice = []
        // console.log('harndlerWord', oneword)
        var word_info = self.parseWord(oneword)
        var parentId = self.wave_id - 1
        if (isHeadWord) {
            isHeadWord = false
            if (self.wavesByKeyword[word_info.keyword]) {
                parentId = self.wavesByKeyword[word_info.keyword][0].id
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
    // console.log('newWave', Array.prototype.slice.call(arguments))
    var wave = {
        id: this.wave_id++,
        type: type,
        keyword: keyword,
        detail: detail,
        parentId: parentId,
    }
    this.waves.push(wave)
    this.wavesById[wave.id] = wave
    if (!this.wavesByKeyword[wave.keyword]) {
        this.wavesByKeyword[wave.keyword] = []
    }
    this.wavesByKeyword[wave.keyword].unshift(wave)
}

WaveManager.prototype.test = function() {
    this.parseMindWaveLanguage(mindWaveDesign)
}

// options: dy, fontSize, margin, radius
// point: startP, secondP, endP, textCX, keywordP, detailP
WaveManager.prototype.layoutWave = function(startP, wave) {
    var o = Object.assign({}, this.options)
    if (wave.type === 'link') {
        wave.gui = this.wavesById[wave.parentId].gui
        return wave.gui
    } else if (wave.type === '-') {
        this.mindWaveCount += 1
        startP = new this.scope.Point(0, 4*(this.mindWaveCount-1)*o.dy).add(this.options.startPoint)
        o.dx = o.margin / 2
        o.dy = 0
    } else if (wave.type[0] === '/') {
        o.dy = -o.dy
    }

    if (wave.parentId && this.wavesById[wave.parentId]) {
        var refwave = this.getRefWave(this.wavesById[wave.parentId])
        if (!refwave[wave.type[0]]) {
            refwave[wave.type[0]] = 1
        }
        console.log('refwave', wave.type[0], wave.keyword, refwave[wave.type[0]], refwave)
        o.dy *= (3*refwave[wave.type[0]] - 2)
        refwave[wave.type[0]] += 1
    }

    // startP = startP.add(options.radius, 0)
    var keywordItem = new this.scope.PointText({
        point: startP,
        content: wave.keyword,
        fillColor: 'black',
        fontSize: o.fontSize
    });
    var detailItem = new this.scope.PointText({
        point: startP,
        content: wave.detail,
        fillColor: 'black',
        fontSize: o.fontSize
    })
    var textWidth = Math.max(keywordItem.bounds.width, detailItem.bounds.width)
    keywordItem.remove()
    detailItem.remove()

    var secondP = startP.add(o.dx, o.dy)
    var endP = secondP.add(o.margin + textWidth, 0)
    var textCx = endP.add((secondP.x - endP.x)/2, 0)
    var keywordP = textCx.add(-keywordItem.bounds.width*0.55, -o.fontSize/4)
    var detailP = textCx.add(-detailItem.bounds.width*0.55, o.fontSize)

    wave.gui = {
        startP: startP,
        secondP: secondP,
        endP: endP,
        textCx: textCx,
        keywordP: keywordP,
        detailP: detailP,
        options: o,
    }
    return wave.gui
}

WaveManager.prototype.getRefWave = function(wave) {
    while (wave.type === 'link' && wave.parentId && this.wavesById[wave.parentId]) {
        wave = this.wavesById[wave.parentId]
    }
    return wave
}

WaveManager.prototype.drawWave = function(wave) {
    if (wave.type === 'link') {
        return
    }
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
    this.options.startPoint = startPoint = startPoint || this.options.startPoint
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
