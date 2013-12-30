var Overlay = {};

var DIV = 'div';

Overlay.init = function()
{
  // just set width or height if we can and trap mouseclicks
  var container = document.createElement(DIV);
  container.id = 'overlay';
  // may not need this
  container.addEventListener('mousedown', function (event) { event.preventDefault(); }, false);
  container.style.cssText = '/* width:100px; */ /* height:50px; */ opacity:0.5; cursor:pointer';

  // textBox adds padding, alignment, background
  var textBox = document.createElement(DIV);
  textBox.id = 'textBox';
  textBox.style.cssText = 'padding:5px 5px 5px 5px; text-align:left; background-color:#000';
  container.appendChild(textBox);

  // text is the content
  var text = document.createElement(DIV);
  text.id = 'text';
  text.style.cssText = 'color:#0ff; font-family:Helvetica,Arial,sans-serif; font-size:36px; font-weight:bold; /* line-height:18px */';
  text.innerHTML = 'W01 E06 L03';
  textBox.appendChild(text);

  // place the overlay in the page
  container.style.position = 'absolute';
  container.style.top = '0px';
  document.body.appendChild(container);
}