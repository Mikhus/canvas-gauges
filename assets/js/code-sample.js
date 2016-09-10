(function() {
    'use strict';

    function animateGauge(gauge) {
        gauge.timer = setInterval(function () {
            gauge.value = Math.random() *
                (gauge.options.maxValue - gauge.options.minValue) +
                gauge.options.minValue;
        }, gauge.animation.duration + 50);
    }

    function stopGauge(gauge) {
        clearInterval(gauge.timer);
        delete gauge.timer;
    }

    function docHeight() {
        var html = document.documentElement;

        return Math.max(body[0].scrollHeight, body[0].offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    function toOption(attr) {
        return attr.split('-').map(function (part, i) {
            return !i ? part.toLowerCase() :
                part.charAt(0).toUpperCase() +
                part.substr(1).toLowerCase();
        }).join('');
    }

    function parse(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'undefined') return undefined;
        if (value === 'null') return null;
        if (/^[\w\d\s]+(?:,[\w\d\s]+)+$/.test(value)) {
            return value.split(',');
        }
        try {
            return JSON.parse(value);
        } catch (e) {
        }
        return value;
    }

    function toJs(src) {
        try {
            var code = 'var gauge = ';
            var type = src.getAttribute('data-type');

            if (type === 'linear-gauge') {
                code += 'new LinearGauge({\n';
            }

            else if (type === 'radial-gauge') {
                code += 'new RadialGauge({\n';
            }

            else {
                return '';
            }

            code += '    renderTo: \'canvas-id\',\n';

            if (src.hasAttributes()) {
                for (var i = 0, s = src.attributes.length; i < s; i++) {
                    var attr = src.attributes[i];

                    if (attr.name && attr.name !== 'data-type') {
                        code += '    ' +
                            toOption(attr.name.replace(/^data-/, '')) + ':' +
                            JSON.stringify(parse(attr.value), null, 4)
                                .split(/\r?\n/)
                                .map(function (line, i) {
                                    return (i ? '    ' : '') + line;
                                }).join('\n') + (i == s - 1 ? '' : ',') + '\n';
                    }
                }
            }

            code += '}).draw();\n';

            return code;
        }

        catch (e) {
            return '';
        }
    }

    try {
        var body = $('body');
        var shade = $('#shade-cover');

        if (!shade.length) {
            shade = $('<div id="shade-cover">').hide();
            body.append(shade);
        }

        shade.pos = function () {
            shade.css({
                width: body.width() + 'px',
                height: docHeight() + 'px'
            });
        };

        $('.example').each(function (id) {
            var tabs = $('\
                <div id="tabs-container' + id + '" class="tabs-container">\
                    <input id="tab-html' + id + '" type="radio" \
                           class="tab-html" name="tab-group">\
                    <label for="tab-html' + id + '">HTML</label>\
                    <input id="tab-js' + id + '" type="radio" \
                           class="tab-js" name="tab-group">\
                    <label for="tab-js' + id + '">JS</label>\
                    <span class="icon-circle-with-cross"></span>\
                    <div class="tabs-content">\
                        <pre class="tab-html-content prettyprint lang-html"\
                        ></pre>\
                        <pre class="tab-js-content prettyprint lang-javascript"\
                        ></pre>\
                    </div>\
                </div>').hide();
            var repos = function() {
                tabs.pos();
                shade.pos();
            };
            var src = $(this);
            var code = src.html().replace(/^\s+|\s+$/g, '');
            var bodyOverflow = body[0].style.overflow;
            var boxHtml = tabs.find('.tab-html-content');
            var boxJs = tabs.find('.tab-js-content');

            tabs.find('*').each(function () {
                this.onclick = function () {};
            });

            if (code.length > 80) {
                code = code.replace(/(\w+=".*?")\s/g, '$1\n    ')
                    .replace(/(\w+=".*?")>/g, '$1\n>');
            }

            body.append(tabs);
            boxHtml.text(code);
            boxJs.text(toJs($(this).find('canvas')[0]));

            tabs.pos = function () {
                tabs.css({
                    left: ((window.innerWidth - tabs.width()) / 2) + 'px',
                    top: ((window.innerHeight - tabs.height()) / 2) + (
                    document.body.scrollTop ||
                    (document.documentElement &&
                        document.documentElement.scrollTop) ||
                    document.body.parentNode.scrollTop) + 'px'
                });
            };

            tabs.show = function () {
                tabs.css({display: 'block'});
                body.css({overflow: 'hidden'});
                shade.css({display: 'block'});
                shade.lockTo = tabs;

                tabs.find('#tab-html' + id)[0].checked = true;
                repos();

                return false;
            };

            tabs.hide = function () {
                tabs.css({display: 'none'});

                if (shade.lockTo === tabs) {
                    shade.css({display: 'none'});
                    delete shade.lockTo;
                    body.css({overflow: bodyOverflow});
                }

                return false;
            };

            tabs.find('.icon-circle-with-cross').on('click', tabs.hide);

            tabs.toggle = function () {
                tabs[0].style.display === 'none' ?
                    tabs.show() : tabs.hide();

                return false;
            };

            body.on('mousedown', function (e) {
                var parent = e.target;

                while (parent) {
                    if (parent === tabs[0] || parent === src[0]) {
                        return false;
                    }

                    parent = parent.parentNode;
                }

                tabs.hide();

                return false;
            });

            shade.on('click', tabs.hide);
            src.on('click', tabs.toggle);

            $(window).on('resize', repos);
        });

        $(document).ready(function () {
            document.gauges.forEach(function (gauge) {
                $(gauge.options.renderTo).on('mouseover', function () {
                    animateGauge(gauge);
                }).on('mouseout', function () {
                    stopGauge(gauge);
                }).attr('title', 'Click me to get my code!');
            });
        });
    } catch (e) {}
}());
