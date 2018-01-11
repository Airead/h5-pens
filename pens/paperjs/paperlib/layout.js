function Layout() {}

// 返回中点及周围均分的点
Layout.circleLayout = function(center, radius, pointNum) {
    var vec = new paper.Point(0, -radius) // up
    var ret = {
        center: center,
        points: []
    }
    var perAngle = 360 / pointNum
    for (var i = 0; i < pointNum; i++) {
        var rotateVec = vec.rotate(perAngle * i)
        ret.points.push(center.add(rotateVec))
    }

    return ret
}

Layout.testCircleLayout = function(point, radius, pointNum) {
    point = point || view.center
    radius = radius || 100
    pointNum = pointNum || 8

    var layout = Layout.circleLayout(point, radius, pointNum)

    var centerCircle = Layout.testPoint(layout.center)
    layout.points.forEach(function(point, i) {
        Layout.testPoint(point)
        var text = Layout.testText(point, i)
        text.rotate(360 / pointNum * i)
    })
}

Layout.testPoint = function(point, options) {
    options = options || {}
    var fillColor = options.fillColor || 'black'
    var radius = options.radius || 2

    var p = new Path.Circle(point, radius)
    p.fillColor = fillColor
}

Layout.testText = function(point, content) {
    var text = new PointText(point)
    text.fillColor = 'black'
    text.content = content
    return text
}

