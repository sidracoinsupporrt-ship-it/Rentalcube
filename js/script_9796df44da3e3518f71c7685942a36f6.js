'use strict';

app.init();
app.name = 'racf';
app.key = 'racf';
app.cache.key = 'racf_';

$(function () {

    $('#form').on('click','.eye-to-see',function() {

        var form = $(this).closest('form');

        var password_input = form.find('input[name="password"]');

        var verify_password_input = form.find('input[name="verify_password"]');

        if( password_input.attr('type') === 'text' ) {

            password_input.attr('type', 'password');

            verify_password_input.attr('type', 'password');

        } else {

            password_input.attr('type', 'text');

            verify_password_input.attr('type', 'text');

        }

    });

    $('.dialog').on('click','.dialog-close',function(e){

        e.preventDefault();

        app.dialog.close($(this).closest('.dialog').attr('id').substr(7));

        return false;

    });

    $('.dialog').on('click','.dialog-button-yes',function(e){

        e.preventDefault();

        var id = $(this).closest('.dialog').attr('id').substr(7);

        var data = $('#dialog-'+id).data('data');

        if( 'function' in data ){

            app.fn.executeFunctionByName(data.function,window,data);

        }

        //app.dialog.close($(this).closest('.dialog').attr('id').substr(7));

        return false;

    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {

        return new bootstrap.Tooltip(tooltipTriggerEl);

    });

    const btnMenu = $("#btnMenu");
    const closeMenu = $("#closeMenu");
    const overlyMenu = $(".menu__overlay");
    const sideMenu = $(".nav__menu .links");

    btnMenu.on("click", () => {
        overlyMenu.addClass("active");
        sideMenu.addClass("active");
        closeMenu.addClass("active");
    });

    closeMenu.on("click", () => {
        closeMenu.removeClass("active");
        overlyMenu.removeClass("active");
        sideMenu.removeClass("active");
    });

    const body = $('body');

    /*const navbarScroll = $('.navbar.nav__menu');

    $(window).on('scroll',function(){

        var scrollTop = $(this).scrollTop();

        if ( scrollTop > 0 ){

            if ( scrollTop < 150 || !navbarScroll.hasClass('on__scroll') ){

                body.css({paddingTop:(navbarScroll.outerHeight())+'px'});

                navbarScroll.addClass('on__scroll');

            }

        } else {

            body.css({paddingTop:''});

            navbarScroll.removeClass('on__scroll');

        }

    }).trigger('scroll');*/

    $('#search_with_tag_random_select').on('click',function(e){

        e.preventDefault();

        var tags_cloud_li = $('.tags-cloud li');

        var rnd = Math.floor( (Math.random() * tags_cloud_li.length) + 1 );

        var elem = tags_cloud_li.eq(~~rnd - 1);

        elem.find('a').trigger('click');

        if( !elem.length ){

            elem = tags_cloud_li.eq(0);

        }

        //elem.find('a').trigger('click');
        elem.find('a')[0].click();

    });

    if( $('#notifications').length ){

        //__notifications_checker();

        window.setInterval(function(){

            __notifications_checker();

        },60000);

        //var notificationsDropdown = document.getElementById('notifications_toggle');

        //notificationsDropdown.addEventListener('show.bs.dropdown', function(){

            //$('#notifications_content_loader').removeClass('d-none');

            //__notifications_getContent();

        //});

        $('#notifications_toggle').on('click',function(){

            __notifications_toggle();

        });

        $('body').on('click',function(event){

            var elem = $( event.target ).closest('#notifications');

            if( !elem.length ){

                $('#notifications_panel').addClass('d-none');

            }

        });

        //$('#notifications_toggle').trigger('click');

    }

});

function _getPopupWindowDimensionsAndPosition(){

    var w = window.innerWidth;

    var h = window.innerHeight;

    if( window.screen ){

        w = window.screen.width;

        h = window.screen.height;

    }

    var width = 1280;

    if( width > w ){

        width = w - ( w * 20/100 );

    }

    var height = h - ( h * 40/100 );

    /*var height = width / 1.818;

    if( height > h ){

        height = h - ( h * 20/100 );

    }*/

    return {

        width : width,

        height : height,

        left : (w - width) / 2,

        top : (h - height) / 2,

    }

}

function _openCallingWindow( url ){

    var winObj = _getPopupWindowDimensionsAndPosition();

    var callWindow = window.open(url, '_blank', 'toolbar=1,scrollbars=1,location=1,status=0,menubar=1,resizable=1,width='+winObj.width+',height='+winObj.height+',left='+winObj.left+',top='+winObj.top,false);

}

function __esd(v){var s = new Date();window.addEventListener("unload", function(e){if('sendBeacon' in navigator){navigator.sendBeacon(app.u('api','stats'),v+']@]'+(new Date()-s));}});}

async function __notifications_checker(){

    const response = await fetch(app.u('api','notifications'));

    if( response.ok ){

        const data = await response.json();

        if( 'an' in data ){

            if( ~~data.an > 0 ){

                $('#notifications_marker').html(data.an).removeClass('d-none');

            } else {

                $('#notifications_marker').addClass('d-none');

            }

        }

    }

}

async function __notifications_getContent(){

    const formData = new FormData();

    formData.append('action', 'fetch');

    const response = await fetch(app.u('api','notifications'),{

        method: 'POST',
        body: formData,

    })
    .then(response => response.json())
    .then(data => {

        __notifications_construct(data);

    })
    .catch((error) => {

      console.error('Error:', error);

    });

}

function __notifications_toggle(){

    var panel = $('#notifications_panel');

    if( !panel.length ){

        return false;

    }

    if( panel.hasClass('d-none') ){

        panel.removeClass('d-none');

        __notifications_getContent();

    } else {

        panel.addClass('d-none');

    }

}

function __notifications_construct( data ){

    var html = '';

    if( data.status ){

        html += '<div class="">';

        for( var i = 0, n = data.items.length; i < n; i++ ){

            if( ~~data.items[i].t === 1 ){

                var txt = 'pending';

                var txt_link = '';

                if( ~~data.items[i].a > 0 ){

                    txt = '<span class="text-success">accepted</span>';

                    txt_link = '<a class="btn-link" href="'+data.items[i].url+'">Start talking</a>';

                }

                html += `

                <div class="notifications_content_item">
                    <div><a href="${data.items[i].url}"><img src="${data.items[i].thumbnail}" alt="${data.items[i].name}" width="80" class="notifications_content_item_image"></a></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between"><em class="small" style="color:#1eb5d8">"Request to Talk" ${txt}</em> <span>${txt_link}</span></div>
                        <div><a href="${data.items[i].url}">${data.items[i].name}</a></div>
                        <div class="small">${data.items[i].date_str}</div>
                    </div>
                </div>

                `;

            } else if( ~~data.items[i].t === 2 ){

                html += `

                <div class="notifications_content_item">
                    <div><img src="${data.items[i].thumbnail}" alt="${data.items[i].name}" width="80" class="notifications_content_item_image"></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between"><em class="small" style="color:#1eb5d8">"Request to Talk"</em> <a class="btn btn-link" href="${data.items[i].url}">Accept request</a></div>
                        <div>${data.items[i].name}</div>
                        <div class="small">${data.items[i].date_str}</div>
                    </div>
                </div>

                `;

            }

        }

        html += '</div>';

    } else {

        html += '<div class="notifications_content_item">Notifications will appear here.</div>';

    }

    $('#notifications_content').html(html);

}
