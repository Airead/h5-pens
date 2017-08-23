function arrowLayout(center, width, height, fat) {
    var hw = width / 2;
    var hh = height / 2;
    var points = [
        center + [-hw, -hh*fat],
        center + [width*fat, -hh*fat],
        center + [width*fat, -hh],
        center + [width, 0],
        center + [width*fat, hh],
        center + [width*fat, hh*fat],
        center + [-hw, hh*fat],
        center + [-hw, -hh*fat],
    ]
    return points
}

function onMouseMove(event) {
    var points = arrowLayout(view.center, 100, 100, .5)
    var path = new Path(points);
    path.strokeColor = 'black';
    // console.log(event)
    var vec = event.point - path.position
    // console.log(vec.angle, path.rotation)
    path.rotate(vec.angle)
    path.removeOnMove()
}

