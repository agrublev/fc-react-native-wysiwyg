(function (global) {
    const DEBUG = false;
    let debug = DEBUG ? console.log.bind(console) : function () {
    };
    const shortid = require('shortid');

    require('./htmlparser.js');
    const removeEmptyChildArrays = (obj) => {
        Object.keys(obj).forEach(name => {
            let val = obj[name];
            if (name === "child" && val.length === 0) {
                delete obj[name];
            } else {
                if (typeof val === "object") {
                    return removeEmptyChildArrays(val);
                } else {
                    obj[name] = val;
                }
            }
        });
    };

    function q(v) {
        return '"' + v + '"';
    }

    function removeDOCTYPE(html) {
        return html
            .replace(/<\?xml.*\?>\n/, '')
            .replace(/<!doctype.*\>\n/, '')
            .replace(/<!DOCTYPE.*\>\n/, '');
    }

    global.html2json = function html2json(html) {
        html = removeDOCTYPE(html);
        let bufArray = [];
        let results = {
            node: 'root',
            child: [],
        };
        const sample = {
            "component": "text",
            "id": "kmxV_Gj2kW",
            "content": [
                {
                    "id": "trypjifqCw",
                    "text": "Yr",
                    "len": 2,
                    "stype": [
                        "bold"
                    ],
                    "styleList": {
                        "fontWeight": "bold"
                    },
                    "tag": "title",
                    "NewLine": true
                }]
        };
        HTMLParser(html, {
            start: function (tag, attrs, unary) {
                debug(tag, attrs, unary);
                // node for this element
                let node = {
                    component: "text",
                    id: shortid.generate(),
                    content:[
                        {
                            "id": shortid.generate(),
                            "text": "",
                            "len": 0,
                            "stype": [
                                // "bold"
                            ],
                            "styleList": {
                                // "fontWeight": "bold"
                            },
                            "tag": "body",
                            "NewLine": true
                        }
                    ],
                    node: 'element',
                    tag: tag,
                };
                if (attrs.length !== 0) {
                    node.attr = attrs.reduce(function (pre, attr) {
                        let name = attr.name;
                        let value = attr.value;
                        let text = "";

                        // has multi attibutes
                        // make it array of attribute
                        if (value.match(/ /)) {
                            value = value.split(' ');
                        }

                        // if attr already exists
                        // merge it
                        if (pre[name]) {
                            if (Array.isArray(pre[name])) {
                                // already array, push to last
                                pre[name].push(value);
                            } else {
                                // single value, make it array
                                pre[name] = [pre[name], value];
                            }
                        } else {
                            // not exist, put it
                            pre[name] = value;
                        }

                        return pre;
                    }, {});
                }
                if (unary) {
                    // if this tag dosen't have end tag
                    // like <img src="hoge.png"/>
                    // add to parents
                    let parent = bufArray[0] || results;
                    if (parent.child === undefined) {
                        parent.child = [];
                    }
                    parent.child.push(node);
                } else {
                    bufArray.unshift(node);
                }
            },
            end: function (tag) {
                debug(tag);
                // merge into parent tag
                let node = bufArray.shift();
                if (node.tag !== tag) console.error('invalid state: mismatch end tag');

                if (bufArray.length === 0) {
                    results.child.push(node);
                } else {
                    let parent = bufArray[0];
                    if (parent.child === undefined) {
                        parent.child = [];
                    }
                    parent.child.push(node);
                }
            },
            chars: function (text) {
                debug(text);
                let node = {
                    text: text,
                };
                if (bufArray.length !== 0) {
                    //     results.child.push(node);
                    // } else {
                    let parent = bufArray[0];
                    if (parent.child === undefined) {
                        parent.child = [];
                    }
                    parent.text = text;
                    parent.content[0].text = text;
                    parent.content[0].len = text.length;
                    // parent.child.push(node);
                } else {
                    results.text = text;
                }
            },
            comment: function (text) {
                debug(text);
                // let node = {
                //     node: 'comment',
                //     text: text,
                // };
                results.text = text;

                let parent = bufArray[0];
                if (parent.child === undefined) {
                    parent.child = [];
                }
                // parent.child.push(node);
            },
        });
        removeEmptyChildArrays(results);
        // iterateObject(results, (value, name) => {
        //     if (value.length === 0 && name === "child") {
        //         return null;
        //     } else {
        //         return value;
        //     }
        // });

        // console.warn("Updated object", deepObject);

        return results;
    };

    global.json2html = function json2html(json) {
        // Empty Elements - HTML 4.01
        let empty = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'embed'];

        let child = '';
        if (json.child) {
            child = json.child.map(function (c) {
                return json2html(c);
            }).join('');
        }

        let attr = '';
        if (json.attr) {
            attr = Object.keys(json.attr).map(function (key) {
                let value = json.attr[key];
                if (Array.isArray(value)) value = value.join(' ');
                return key + '=' + q(value);
            }).join(' ');
            if (attr !== '') attr = ' ' + attr;
        }

        if (json.node === 'element') {
            let tag = json.tag;
            if (empty.indexOf(tag) > -1) {
                // empty element
                return '<' + json.tag + attr + '/>';
            }

            // non empty element
            let open = '<' + json.tag + attr + '>';
            let close = '</' + json.tag + '>';
            return open + child + close;
        }

        if (json.node === 'text') {
            return json.text;
        }

        if (json.node === 'comment') {
            return '<!--' + json.text + '-->';
        }

        if (json.node === 'root') {
            return child;
        }
    };
})(this);
