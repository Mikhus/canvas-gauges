(function() {
    'use strict';

    var styles = $('<style>\
        .tabs-container {\
            margin: 0 auto;\
            width: 50%;\
            border: 25px solid rgba(255,230,106,1);\
            background: #fff;\
            overflow: hidden;\
        }\
        .tabs-container .icon-circle-with-cross {\
            float: right;\
            font-size: 24px;\
            cursor: pointer;\
            margin-right: 5px;\
            color:#999;\
        }\
        .tabs-container .icon-circle-with-cross:hover {\
            color:#222\
        }\
        .tabs-container input {\
            visibility: hidden;\
        }\
        .tabs-container label {\
            background: #fff;\
            color: #888;\
            cursor: pointer;\
            display: block;\
            float: left;\
            font-size: 1em;\
            height: 2.5em;\
            line-height: 2.5em;\
            padding: 0 1.5em;\
            text-align: center;\
        }\
        .tabs-container input:hover + label {\
            background: #eee;\
            color: #222;\
        }\
        .tabs-container input:checked + label {\
            background: #eee;\
            color: #444;\
            position: relative;\
            z-index: 6;\
        }\
        .tabs-content {\
            min-height: 20em;\
            position: relative;\
            width: 100%;\
            z-index: 5;\
        }\
        .tabs-content pre {\
            width: 100%;\
            border: 0;\
            opacity: 0;\
            padding: 10px 15px;\
            position: absolute;\
            z-index: -100;\
            overflow: auto;\
            height: 100%;\
        }\
        .tabs-container input.tab-html:checked ~ .tabs-content .tab-html-content,\
        .tabs-container input.tab-js:checked ~ .tabs-content .tab-js-content {\
            opacity: 1;\
            z-index: 100;\
        }\
        input.visible {\
            visibility: visible !important;\
        }\
        </style>');
    var body = $('body');
    var shade = $('#shade-cover');

    function animateGauge(gauge) {
        gauge.timer = setInterval(function() {
            gauge.value = Math.random() *
                (gauge.options.maxValue - gauge.options.minValue) +
                gauge.options.minValue;
        }, gauge.animation.duration + 50);
    }

    function stopGauge(gauge) {
        clearInterval(gauge.timer);
        delete gauge.timer;
    }

    body.append(styles);

    if (!shade.length) {
        shade = $('<div id="shade-cover">').css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            background: 'rgba(36,101,192, .85)'
        }).hide();
        body.append(shade);
    }

    shade.pos = function() {
        var html = document.documentElement;
        var height = Math.max(body[0].scrollHeight, body[0].offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        shade.css({
            width: body.width() + 'px',
            height: height + 'px'
        });
    };

    function toOption(attr) {
        return attr.split('-').map(function(part, i) {
            return i ? (i === 1 ?
                part.toLowerCase() :
                part.charAt(0).toUpperCase() + part.substr(1).toLowerCase()) :
                '';
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
        try { return JSON.parse(value); } catch(e) {}
        return value;
    }

    function toJs(src) {
        var code = 'var gauge = ';
        var type = src.getAttribute('data-type');
        var keys = Object.keys(src.attributes);
        var s = keys.length;

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


        keys.forEach(function (i) {
            var attr = src.attributes[i];

            if (attr.name.substr(0, 5) === 'data-' && attr.name !== 'data-type') {
                code += '    ' + toOption(attr.name) + ':' +
                    JSON.stringify(parse(attr.value), null, 4).split(/\r?\n/).map(function(line, i) {
                        return (i ? '    ' : '') + line;
                    }).join('\n') + (i == s - 1 ? '' : ',') + '\n';
            }
        });

        code += '}).draw();\n';

        return code;
    }

    $('.example').each(function(id) {
        var tabs = $('\
        <div id="tabs-container' + id + '" class="tabs-container">\
            <input id="tab-html' + id + '" type="radio" class="tab-html" name="tab-group">\
            <label for="tab-html' + id + '">HTML</label>\
            <input id="tab-js' + id + '" type="radio" class="tab-js" name="tab-group">\
            <label for="tab-js' + id + '">JavaScript</label>\
            <span class="icon-circle-with-cross"></span>\
            <div class="tabs-content">\
                <pre class="tab-html-content prettyprint lang-html"></pre>\
                <pre class="tab-js-content prettyprint lang-javascript"> </pre>\
            </div>\
        </div>');

        var src = $(this);
        var code = src.html().replace(/^\s+|\s+$/g, '');

        var bodyOverflow = body[0].style.overflow;
        var boxHtml = tabs.find('.tab-html-content');
        var boxJs = tabs.find('.tab-js-content');

        if (code.length > 80) {
            code = code.replace(/(\w+=".*?")\s/g, '$1\n    ')
                .replace(/(\w+=".*?")>/g, '$1\n>');
        }

        body.append(tabs);
        boxHtml.text(code);
        boxJs.text(toJs($(this).find('canvas')[0]));

        tabs.css({
            position: 'absolute',
            display: 'none',
            zIndex: 2
        });

        tabs.pos = function() {
            tabs.css({
                left: ((window.innerWidth - tabs.width()) / 2) + 'px',
                top: ((window.innerHeight - tabs.height()) / 2) + body[0].scrollTop + 'px',
            });
        };

        tabs.show = function() {
            tabs.find('#tab-html' + id).click();
            tabs.css({
                visibility: 'hidden',
                display: 'block'
            });

            body.css({ overflow: 'hidden' });

            if (tabs[0].scrollHeight > tabs[0].offsetHeight) {
                tabs.css({
                    width: tabs[0].offsetWidth + 20 + 'px'
                });
            }

            tabs.pos();
            shade.pos();

            tabs.css({ visibility: 'visible' });
            shade.css({ display: 'block' });
            shade.lockTo = tabs;
        };

        tabs.hide = function() {
            tabs.css({ display: 'none' });

            if (shade.lockTo === tabs) {
                shade.css({ display: 'none' });
                delete shade.lockTo;
                body.css({ overflow: bodyOverflow });
            }
        };

        tabs.find('.icon-circle-with-cross').on('click', tabs.hide);

        tabs.toggle = function() {
            tabs[0].style.display === 'none' ? tabs.show() : tabs.hide();
        };

        body.on('mousedown', function(e) {
            var parent = e.target;

            while (parent) {
                if (parent === tabs[0] || parent === src[0]) {
                    return;
                }

                parent = parent.parentNode;
            }

            tabs.hide();
        });

        src.on('click', tabs.toggle);

        $(window).on('resize', function() {
            tabs.pos();
            shade.pos();
        });
    });

    $(document).ready(function() {
        document.gauges.forEach(function(gauge) {
            $(gauge.options.renderTo).on('mouseover', function() {
                animateGauge(gauge);
            }).on('mouseout', function() {
                stopGauge(gauge);
            });
        });
    });
}());
