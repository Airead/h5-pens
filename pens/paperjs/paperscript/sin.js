project.currentStyle = {
    strokeColor: 'black'
}


var line = new Path()
var sin = new Path()

window.line = line

var startPoint = new Point(100, view.center.y)
line.moveTo(startPoint)
sin.moveTo(startPoint)
var start = Date.now()
var totaltime = 3 * 1000
var length = 500
// sin.selected = true
// line.selected = true

circle = new Path.Circle({
    radius: 4,
    fillColor: 'red',
    strokeColor: null,
    center: startPoint
})

function onFrame() {
    var newx = (Date.now() - start) / totaltime * length;
    startPoint.x = 100 + newx
    // console.log(line.lastSegment.point)
    if (startPoint.x < length) {
        line.lineTo(startPoint)

        var dy = -Math.sin((startPoint.x - 100) / 30) * 100
        sin.lineTo(startPoint.x, startPoint.y + dy)
        sin.smooth()

        circle.position = [startPoint.x, startPoint.y + dy]
    } else {
        // sin.simplify()
    }

}

