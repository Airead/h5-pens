 main();

 function main() {
     var content = document.getElementById('cards');
     var cards = createCards();

     for (var i = 0; i < cards.length; i++) {
         var div = createNode('div', 'mdl-cell mdl-cell--6-col');
         div.appendChild(cards[i]);
         content.appendChild(div);
     }
 }

 function createCards() {
     var cards = [];

     // colorDefs in mcolors.js

     var names = Object.keys(colorDefs);

     for (var i = 0; i < names.length; i++) {
         var name = names[i];
         cards.push(createColorCard(name, colorDefs[name]));
     }

     return cards;
 }

 function createColorCard(name, colorList) {
     var container = createNode('div', 'color-card');

     var titleDiv = createTitleDiv(name, colorList);
     var primaryDiv = createPrimaryDiv(name, colorList);
     container.appendChild(titleDiv);
     container.appendChild(primaryDiv);

     if (colorList['A100']) {
         var accentDiv = createAccentDiv(name, colorList);
         container.appendChild(accentDiv);
     }

     return container;
 }

 function createTitleDiv(name, colorList) {
     var container = createNode('div', 'color-card--title');

     var h1 = createNode('h1', 'color-card--title-text');
     var type = createNode('span', 'color-card--title-type');
     var rgb = createNode('span', 'color-card--title-rgb');

     h1.innerHTML = name;
     type.innerHTML = '500';
     rgb.innerHTML = colorList['500'];
     container.style.background = colorList['500'];

     container.appendChild(h1);
     container.appendChild(type);
     container.appendChild(rgb);

     return container;
 }

 function createPrimaryDiv(name, colorList) {
     var container = createNode('div', 'color-card--primary');

     var types = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
     for (var i = 0; i < types.length; i++) {
         var type = types[i];
         var lineDiv = createCardLine(type, colorList[type]);
         container.appendChild(lineDiv);
     }

     return container;
 }

 function createAccentDiv(name, colorList) {
     var container = createNode('div', 'color-card--accent');

     var types = ['A100', 'A200', 'A400', 'A700'];
     for (var i = 0; i < types.length; i++) {
         var type = types[i];
         var lineDiv = createCardLine(type, colorList[type]);
         container.appendChild(lineDiv);
     }

     return container;
 }

 function createCardLine(type, rgb) {
     var container = createNode('div', 'color-card--line');
     var typeSpan = createNode('span', 'color-card--line-type');
     var hsvSpan = createNode('span', 'color-card--line-hsv');
     var rgbSpan = createNode('span', 'color-card--line-rgb');

     var tinyC = tinycolor(rgb).toHsv();
     var hsv = [tinyC.h.toFixed(0), (tinyC.s * 100).toFixed(0), (tinyC.v * 100).toFixed(0)].join(',');

     console.log('create line');
     typeSpan.innerHTML = type;
     rgbSpan.innerHTML = rgb;
     hsvSpan.innerHTML = hsv;
     container.style.background = rgb;

     container.appendChild(typeSpan);
     container.appendChild(hsvSpan);
     container.appendChild(rgbSpan);

     return container;
 }

 function createNode(tag, className) {
     var n = document.createElement(tag)
     n.className = className;
     return n;
 }