/**
* Bootstrap-Tooltip - v1.0.0
* git://github.com/jonnyzhu/bootstrap-tooltip.git
* Copyright 2016 Jonny Zhu. Licensed MIT.
*/
'use strict';
var BootstrapTooltip = (function () {
    var self = {};
    // a lightweight js to implement drag and move operation
    // options: {
    //     handle: the handle of drag object, a class name is required,
    //     start: a callback function while drag start,
    //     stop: a callback function while drag stop
    // }
    $.fn.draggable = function(options) {
        var $object = $(this);
        var $handle = options.handle ? $object.find(options.handle) : $object;
        var offsetX = 0, offsetY = 0;
        $handle.bind('mousedown', function(event) {
            var event = event || window.event;
            offsetX = event.clientX - $object.offset().left;
            offsetY = event.clientY - $object.offset().top;
            $object.addClass('bootstrap-dragging');
            // to prevent text selection while moving tooltip
            $(document).bind('selectstart', function() {
                return false;
            });
            if (options.start) options.start();
        });
        $(document).bind('mousemove', function(event) {
            var event = event || window.event;
            if ($object.hasClass('bootstrap-dragging'))
                $object.css({
                    left: event.clientX - offsetX,
                    top: event.clientY - offsetY
                });
        });
        $(document).bind('mouseup', function() {
            $object.removeClass('bootstrap-dragging');
            $(document).unbind('selectstart');
            if (options.stop) options.stop();
        });
        return $(this);
    };
    // a popup and moveable tooltip display based on bootstrap.
    // options: {
    //     content: html body on the tooltip,
    //     event: click event as optional
    // }
    self.show = function(options) {
        var $tooltip = $('<div>').addClass('bootstrap-tooltip').attr('id','view')
            .append($('<div>')
                .append('<div>').append('<div>').append('<div>')
                .append($('<i>').addClass('glyphicon').addClass('glyphicon-remove-circle')
                    .attr('onclick', 'BootstrapTooltip.remove(this)')))
            .append($('<div>')
                .append('<div>').append($('<div>').append(options.content)).append('<div>'))
            .append($('<div>')
                .append('<div>').append('<div>').append('<div>'))
            .append($('<i>').addClass('glyphicon').addClass('glyphicon-pushpin'))
            .appendTo('body');
        // default on screen center
        var x = (document.body.clientWidth - $tooltip[0].offsetWidth) / 2;
        var y = (document.body.clientHeight - $tooltip[0].offsetHeight) / 2;
        // following mouse pointer
        if (options.event) {
            try {
                var eventX = options.event.pageX || options.event.clientX;
                var eventY = options.event.pageY || options.event.clientY;
                x = eventX + $tooltip[0].offsetWidth < document.body.clientWidth
                    ? eventX - 15
                    : document.body.clientWidth - $tooltip[0].offsetWidth -15;
                y = eventY - 15;
            } catch (e) {
            }
        }
        $tooltip.css({
            left: x,
            top: y
        }).fadeIn().draggable({
            handle: '.glyphicon-pushpin'
        });
    };
    // Remove the tooltip
    self.remove = function(button) {
        $(button).closest('.bootstrap-tooltip').fadeOut('normal', function() {
            $(this).remove();
        });
    };
    return self;
})();
