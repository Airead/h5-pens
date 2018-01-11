/*
阳爻高 7 宽 49
阴爻高 7 宽 20 隔 9
三爻卦高 35 宽 49
六爻卦高 77 宽 49

地方卦卦 上间 28 东间 60

八卦45度 64卦 5.625度

TDSHFLMW 天地水火风雷山泽  M山 W泽 象形
*/

function Dao(scope) {
    this.primaryColor = 'black'
    this.scope = scope;
    this.view = scope.view;
    this.defaultPosition = this.view.center;
    this.sizeDef = {
        yang: {
            width: 49,
        },
        yin: {
            width: 20,
            bewteen: 9
        },
        yaoHeight: 7,
        yaoBetween: 7,
    }

    this.genPrototypeMethods()

    this.symbols = {}
    this.genSymbols()
}

// 只定义阴阳两仪，然后通过 genSymbols 可以生成任意意象
Dao.prototype.symbolDef = {
    yin: {
        def: '0',
    },
    yang: {
        def: '1',
    },
    shaoyang: {
        def: '01',
    },
    taiyang: {
        def: '11',
    },
    shaoyin: {
        def: '10',
    },
    taiyin: {
        def: '00',
    },
    qian: {
        def: '111',
    },
    dui: {
        def: '110',
    },
    li: {
        def: '101',
    },
    zhen: {
        def: '100',
    },
    xun: {
        def: '011',
    },
    kan: {
        def: '010',
    },
    gen: {
        def: '001',
    },
    kun: {
        def: '000',
    }
}

// 为 Dao 生成原型方法
Dao.prototype.genPrototypeMethods = function() {
    var self = this
    Object.keys(self.symbolDef).forEach(function (name) {
        if (['yin', 'yang'].indexOf(name) >= 0) {
            return
        }
        Dao.prototype[name] = function() {
            return self.genYaos(self.symbolDef[name].def)
        }
    })
}

// 生成方便使用的 symbols
// symbol will be used in ohter symbols
Dao.prototype.genSymbols = function () {
    var self = this
    Object.keys(this.symbolDef).forEach(function(name) {
        self.symbols[name] = new self.scope.Symbol(self[name]())
    })
}

// from chuyao to 6yao
Dao.prototype.genYaos = function(yaoNames) {
    var self = this;
    var yaos = []
    yaoNames.split('').forEach(function(name) {
        name = name === '0' ? 'yin' : 'yang'
        yaos.push(self[name]())
    })

    self.placeYaos(yaos)
    return new self.scope.Group(yaos)
}

Dao.prototype.placeYaos = function(yaos) {
    var dy = this.sizeDef.yaoHeight + this.sizeDef.yaoBetween
    yaos.forEach(function(yao, i) {
        yao.position = yao.position.add([0, -i * dy])
    })
}

Dao.prototype.yang = function () {
    var path = new this.scope.Path.Rectangle(this.view.center, new this.scope.Size(this.sizeDef.yang.width, this.sizeDef.yaoHeight))
    var group = new this.scope.Group(path)
    group.fillColor = this.primaryColor
    return group
}

Dao.prototype.yin = function () {
    var left = new this.scope.Path.Rectangle(this.view.center, new this.scope.Size(this.sizeDef.yin.width, this.sizeDef.yaoHeight))
    var right = left.clone()
    right.position = right.position.add([this.sizeDef.yin.width + this.sizeDef.yin.bewteen, 0])
    var group = new this.scope.Group([left, right])
    group.fillColor = this.primaryColor
    return group
}
