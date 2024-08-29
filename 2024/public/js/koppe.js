/*
 * @package koppefest
 *
 * @file jquery handler
 * @author Christoph Kappel <christoph@unexist.dev>
 * @version $Id: 2024/koppe.rb,v 0 1724858416.0-7200 unexist $
 *
 * This program can be distributed under the terms of the GNU GPLv3.
 * See the file COPYING for details.
 */

$(document).ready(function() {

    /**
     * Show toast message
     *
     * @param {String}    str    Message string to show
     ***/

    function showToast(str) {
        /* Insert flash element */
        var flash = $('<div class="flash" style="display: none;"></div>');
        var box     = $('<div class="box primary"></div>');
        var mesg    = $('<span></span>');

        mesg.append(str);
        box.append(mesg);
        flash.append(box);

        /* Click to hide box immediately */
        flash.click(function() {
            flash.remove();
        });

        /* Find count of flash elements */
        var flashes = $('div.flash');

        $('#page').append(flash);

        if (0 < flashes.length) {
            flash.css('top', (parseInt(flash.css('top'))
                - flashes.length * (flash.outerHeight(true) + 10)) + 'px');
        }

        /* Display message for some time */
        flash.fadeIn('slow').delay(5000).hide('slow', function() {
            var height = flash.outerHeight(true);

            flash.remove();

            var flashes = $('div.flash');

            if (0 < flashes.length) {
                for(var i = 0; i < flashes.length; i++) {
                    var f = $(flashes[i]);

                    f.css('top', (parseInt(f.css('top')) -
                        - height + 10) + 'px');
                }
            }
        });
    }

    /* Handle cancellation */
    $('.cancel').click(function(e) {
        var elems = $('input[type="number"], textarea');

        elems.each(function(idx, elem) {
            var that = $(elem);

            if (that.is('input')) {
                that.val(0);
            } else {
                that.val('');
            }
        });

        $('.submit').trigger('click');
    });


    /* Handle submit */
    $('.submit').click(function(e) {
        const fields = [
            'houseno', 'adultsno', 'childrenno', 'beerbenchsno',
            'gardentablesno', 'chairsno', 'standtablesno', 'walltablesno',
            'tentsno', 'grillsno', 'parasolsno'
        ];
        var errno = 0;
        var data = {};

        /* Sanity check fields */
        $(fields).each(function(idx, elemName) {
            var elem = $('#' + elemName);
            var value = elem.val();

            if ("" === value || isNaN(value)) {
                elem.css('border-color', 'red');
                errno++;
            } else {
                data[elemName] = value;
            }
        });

        if (0 === errno) {
            $.ajax({
                type: 'POST',
                url: '/visit',
                data: $.extend({}, data, {
                    foods: $('#foods').val(),
                    drinks: $('#drinks').val(),
                    misc: $('#misc').val(),
                    buildup: $('#buildup').is(':checked') ? 1 : 0,
                    teardown: $('#teardown').is(':checked') ? 1 : 0,
                }),

                /* Success handler */
                success: function (data, status) {
                    /* Insert data */
                    $('#list').prepend($('<div style="margin-top: 30px"><span class="icon">&sharp;'
                        + $('#houseno').val() + '</span></div>'));

                    /* Reset errors */
                    $(fields).each(function(idx, elemName) {
                        var elem = $('#' + elemName);

                        elem.css('border-color', 'black');
                    });

                    /* Update UI */
                    showToast('Wir freuen uns!');
                },

                /* Error handler */
                error: function (xhr, status, e) {
                    showToast('Das ging schief: ' + xhr.responseText);
                }
            });
        } else {
            showToast("Bitte alle rot umrandeten Felder ausfüllen!");
        }
    });
});
