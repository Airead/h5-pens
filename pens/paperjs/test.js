var primaryColor = '#3f51b5';
var accentColor = '#ff4081';

var path = new Path.Circle({
    center: view.center,
    radius: 100,
    strokeColor: primaryColor,
});

function onResize() {
    path.position = view.center;
}
