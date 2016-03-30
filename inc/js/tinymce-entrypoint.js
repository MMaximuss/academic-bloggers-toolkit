"use strict";
var Dispatcher_1 = require('./utils/Dispatcher');
tinymce.PluginManager.add('abt_main_menu', function (editor, url) {
    var ABT_Button = {
        type: 'menubutton',
        image: url + '/../images/book.png',
        title: 'Academic Blogger\'s Toolkit',
        icon: true,
        menu: [],
    };
    var openInlineCitationWindow = function () {
        editor.windowManager.open({
            title: 'Inline Citation',
            url: ABT_locationInfo.tinymceViewsURL + 'inline-citation.html',
            width: 400,
            height: 85,
            onClose: function (e) {
                if (!e.target.params.data) {
                    return;
                }
                editor.insertContent('[cite num=&quot;' + e.target.params.data + '&quot;]');
            }
        });
    };
    var openFormattedReferenceWindow = function () {
        editor.windowManager.open({
            title: 'Insert Formatted Reference',
            url: ABT_locationInfo.tinymceViewsURL + 'formatted-reference.html',
            width: 600,
            height: 100,
            onclose: function (e) {
                if (Object.keys(e.target.params).length === 0) {
                    return;
                }
                editor.setProgressState(1);
                var payload = e.target.params.data;
                var refparser = new Dispatcher_1.default(payload, editor);
                if (payload.hasOwnProperty('manual-type-selection')) {
                    refparser.fromManualInput(payload);
                    editor.setProgressState(0);
                    return;
                }
                refparser.fromPMID();
            },
        });
    };
    var generateSmartBib = function () {
        console.log(this);
        var dom = editor.dom.doc;
        var existingSmartBib = dom.getElementById('abt-smart-bib');
        if (!existingSmartBib) {
            var smartBib_1 = dom.createElement('OL');
            var horizontalRule = dom.createElement('HR');
            smartBib_1.id = 'abt-smart-bib';
            horizontalRule.className = 'abt_editor-only';
            var comment = dom.createComment("Smart Bibliography Generated By Academic Blogger's Toolkit");
            dom.body.appendChild(comment);
            dom.body.appendChild(horizontalRule);
            dom.body.appendChild(smartBib_1);
            this.state.set('disabled', true);
        }
        return;
    };
    var separator = { text: '-' };
    var bibToolsMenu = {
        text: 'Other Tools',
        menu: [],
    };
    var inlineCitation = {
        text: 'Inline Citation',
        onclick: openInlineCitationWindow,
    };
    editor.addShortcut('meta+alt+c', 'Insert Inline Citation', openInlineCitationWindow);
    var formattedReference = {
        text: 'Formatted Reference',
        onclick: openFormattedReferenceWindow,
    };
    editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', openFormattedReferenceWindow);
    var smartBib = {
        text: 'Generate Smart Bibliography',
        id: 'smartbib',
        onclick: generateSmartBib,
        disabled: false,
    };
    var trackedLink = {
        text: 'Tracked Link',
        onclick: function () {
            var user_selection = tinyMCE.activeEditor.selection.getContent({ format: 'text' });
            editor.windowManager.open({
                title: 'Insert Tracked Link',
                width: 600,
                height: 160,
                buttons: [{
                        text: 'Insert',
                        onclick: 'submit'
                    }],
                body: [
                    {
                        type: 'textbox',
                        name: 'tracked_url',
                        label: 'URL',
                        value: ''
                    },
                    {
                        type: 'textbox',
                        name: 'tracked_title',
                        label: 'Link Text',
                        value: user_selection
                    },
                    {
                        type: 'textbox',
                        name: 'tracked_tag',
                        label: 'Custom Tag ID',
                        tooltip: 'Don\'t forget to create matching tag in Google Tag Manager!',
                        value: ''
                    },
                    {
                        type: 'checkbox',
                        name: 'tracked_new_window',
                        label: 'Open link in a new window/tab'
                    },
                ],
                onsubmit: function (e) {
                    var trackedUrl = e.data.tracked_url;
                    var trackedTitle = e.data.tracked_title;
                    var trackedTag = e.data.tracked_tag;
                    var trackedLink = ("<a href=\"" + trackedUrl + "\" id=\"" + trackedTag + "\" ") +
                        ((e.data.tracked_new_window ? 'target="_blank"' : '') + ">" + trackedTitle + "</a>");
                    editor.execCommand('mceInsertContent', false, trackedLink);
                }
            });
        }
    };
    var requestTools = {
        text: 'Request More Tools',
        onclick: function () {
            editor.windowManager.open({
                title: 'Request More Tools',
                body: [{
                        type: 'container',
                        html: "<div style=\"text-align: center;\">" +
                            "Have a feature or tool in mind that isn't available?<br>" +
                            "<a " +
                            "href=\"https://github.com/dsifford/academic-bloggers-toolkit/issues\" " +
                            "style=\"color: #00a0d2;\" " +
                            "target=\"_blank\">Open an issue</a> on the GitHub repository and let me know!" +
                            "</div>",
                    }],
                buttons: [],
            });
        }
    };
    setTimeout(function () {
        var dom = editor.dom.doc;
        var existingSmartBib = dom.getElementById('abt-smart-bib');
        if (existingSmartBib) {
            smartBib.disabled = true;
            smartBib.text = 'Smart Bibliography Generated!';
        }
    }, 500);
    bibToolsMenu.menu.push(trackedLink, separator, requestTools);
    ABT_Button.menu.push(smartBib, inlineCitation, formattedReference, bibToolsMenu);
    editor.addButton('abt_main_menu', ABT_Button);
});
