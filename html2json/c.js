const html2json = require('./html2json.js').html2json;
let res = html2json(`<div><p>sadsadasd</p><p><em>Italic</em></p>

<p><strong>Bold  here - </strong><u>underline</u></p>

<h1>Heading 1</h1>

<p>Paragraph</p>

<h2>Heading two</h2>

<ul>
\t<li>Normal list</li>
\t<li>asd</li>
</ul>

<p>Test</p>

<ol>
\t<li>Nuumbered list</li>
</ol></div>`);
console.log(JSON.stringify(res));
