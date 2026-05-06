var app = (function(){

  var name = '';
  var key = '';

  return {

    vars : {},

    init : function(){

      this.cache.init();

      //this.cache.load();

      //this.settings.load();

      return this;

    },

    settings:{

      obj:{

      },

      set:function(key,value){

        if(!this.obj[key]){

          this.obj[key] = value;
        }
        else{

          if(typeof value === 'object'){
            for(var i in value) this.obj[key][i] = value[i];
          }

        }

        //console.log(this.obj);

        return this;
      },

      load:function(){

        var settings = app.cache.get('settings');

        if(settings){

          app.settings.obj = JSON.parse(settings);

        }else{

/*
          app.func.ajax.do({
            data:{
              action:'getSettings',
            },
            dataType: 'json',
            url:_u('app','/actions'),
          },function(msg){

            if(msg.success){

              app.settings.obj = JSON.parse(msg.data);
              app.cache.settings();

            }

          });*/

        }

      },

      save:function(){

        //app.cache.save('settings',app.settings.obj);

        console.log('settings save');

        app.cache.settings();

      },

    },//settings about each users

  };

})();

app.ajax = (function (that) {

    "use strict";

    var app = {

        stack : [],

        call : function( obj, onDone, onFail, onAlways ){

            var obj_data = {

                type:obj.type || 'POST',
                url:obj.url || '',
                data:obj.data || '',
                dataType:obj.dataType || '',
                async : true,
                requestHeaders : {},

            };

            Object.assign(obj_data,obj);

            return _getPromise(obj_data);

        },

    };

    var _getPromise = function(ajax_data){

        return new Promise(function(resolve, reject) {

            $.ajax(ajax_data).done(function(msg){

                resolve(msg);

            }).fail(function(jqXHR, textStatus){

                reject(Error(textStatus));

            });

/*
      var data = '';

      var query = [];

      for (var key in ajax_data.data) {

        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(ajax_data.data[key]));

      }

      if( ajax_data.type === 'GET' ){

        ajax_data.url+=(query.length ? '?' + query.join('&') : '');

      }

      if( ajax_data.type === 'POST' ){

        data = query.join('&');

      }


      if( ajax_data.type === 'GET_JSONP' ){

        query.push('callback=jsonp_callback');

        ajax_data.url+=(query.length ? '?' + query.join('&') : '');


        var newScript = document.createElement("script");

        newScript.type = "text/javascript";

        newScript.src = ajax_data.url;

        var head = document.getElementsByTagName("head")[0];

        head.appendChild(newScript);

        return false;

      }

      var request = new XMLHttpRequest();

      request.open(ajax_data.type, ajax_data.url, ajax_data.async);

      if( ajax_data.type === 'POST' ){

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      }

      for(var key in ajax_data.requestHeaders){

        request.setRequestHeader(key, ajax_data.requestHeaders[key]);

      }

      request.onload = function() {

        if (this.status >= 200 && this.status < 400) {

          var response = request.responseText;

          if( ajax_data.dataType === 'json' ){

           try {

              response = JSON.parse(response);

            } catch (e) {

              reject(Error('Not Valid json response'));

            }

          }

          resolve(response);

        } else {

           var resp = request.responseText;

          reject(Error(resp));

        }
      };

      request.onerror = function() {

         var resp = request.responseText;

        reject(Error(resp));

      };

      request.send(data);
*/

        });

    };

    return app;

})(app || {});

//Requires jQuery
//TODO: remove jQuery

app.dialog = {

  setColors : false,

  load : (function(id,obj){

    var zIndex = _getZindex();

    var options = {

      id : '',
      title : '',
      text : '',
      modal : 0,
      fixed : 0,
      hideVerticalScrollbar : 0,
      data : { },
      onBeforeOpen : null,
      onOpen : null,
      onBeforeClose : null,
      onClose : null,

      overlayBackground : 'rgba(255,255,255,.3)',
      overlayOpacity : 1,
      overlayTransition : 'fade', //fade or none
      overlayTransitionSpeed : 300,

      width : 'auto',
      height : 'auto',
      position : 'middle,center',
      position_offset : '0,0,0,0',
      background : '#fff',
      opacity : 1,
      hasframe : 0,

      setColors : app.dialog.setColors,

    };

    Object.assign(options, obj);

    app.dialog.setColors = options.setColors;

    options.id = id;

    var elem = $('#dialog-'+options.id);

    if(elem.length){

      Object.assign(options, elem.data());

      if( obj && 'data' in obj ){

        Object.assign(options.data, obj.data);

      }

      app.dialog.setColors = options.setColors;

      elem.data( 'data', options.data );

      if( options.title !== '' ) elem.find('.dialog-title').text( options.title );

      if( options.text !== '' ) elem.find('.dialog-data').html(options.text);

      if( typeof( options.onBeforeOpen ) === 'function' ) options.onBeforeOpen();

      if( options.hideVerticalScrollbar ) $('body').css( 'overflow-y', 'hidden' );

      if( parseInt( options.modal, 10 ) ) _showOverlay();

      _position( 1 );

      if( typeof( options.onOpen ) === 'function' ) options.onOpen(elem);

    }

    function _position(autoZIndex){

      var elem = $('#dialog-'+options.id);

      var w = $(window).width();
      var h = $(window).height();

      var ew = 0;
      var ewd = options.width;

      ewd = '' + ewd;

      var lastChar = ewd.substr(-1);
      if( lastChar === '%' ) {
        //var k = ewd.substr(0, ewd.length-1);
        ew = (parseFloat(ewd,10) * w) / 100;
      } else if(ewd === 'auto') {
        ew = elem.outerWidth(true);
      } else {
        ew = parseFloat(ewd,10);
      }

      var eh = 0;
      var ehd = options.height;

      ehd = '' + ehd;

      var lastChar = ehd.substr(-1);
      if( lastChar === '%' ) {
        //var k = ehd.substr(0, ehd.length-1);
        eh = (parseFloat(ehd,10) * h) / 100;
      } else if(ehd === 'auto') {
        eh = elem.outerHeight(true);
      } else {
        eh = parseFloat(ehd,10);
      }

      var css = {

        display : 'block',

      };

      if(autoZIndex) css.zIndex = zIndex++;

      if( ewd !== 'auto' ){

        css.width = ew;

      }

      if( ehd !== 'auto' ){

        css.height = eh;

      }

      elem.css(css);

      if(options.hasframe){

        var dd = elem.find('.dialog-data');
        var ddh = dd.outerHeight();
        elem.find('iframe').css({

          width : ew,
          height : eh,

        });

      }

      if( options.fixed ){

        css.position = 'fixed';

      }

      //if( !fixed ){

        //css.top = ( (h - eh) / 2 ) + $(window).scrollTop();

      //}

      var position = {

        top : 'middle',
        left : 'center'

      };

      var position_data = options.position || 'middle,center';

      var position_array = ('' + position_data).split(',');

      if(position_array[0]) position.top = position_array[0];
      if(position_array[1]) position.left = position_array[1];

      var position_offset = { 0 : 0, 1 : 0, 2 : 0, 3 : 0 };

      var position_offsets_array = (''+( options.position_offset || 0 )).split(',');
      var par = 0;
      for(var i = 0 , n = position_offsets_array.length; i < n; i++){

        var lastChar = position_offsets_array[i].substr(-1);
        if( lastChar === '%' ) {

          if( i === 0 || i === 2 ) par =  h;
          else if( i === 1 || i === 3 ) par = w;

          position_offset[i] = ( ( parseFloat( position_offsets_array[i], 10 ) * par ) / 100 );

        } else {

          position_offset[i] = parseFloat( position_offsets_array[i], 10 );

        }

      }

      var pos = {};

      switch(position.top){

        case'top':

          css.top = 0 + position_offset[0];

          if( !options.fixed ) css.top = css.top + $(window).scrollTop();

        break;

        case'bottom':

          css.top = h - eh - position_offset[2];

          if( !options.fixed ) css.top = css.top + $(window).scrollTop();

        break;

        case'middle':

          css.top = ( (h - eh) / 2 ) + position_offset[0] - position_offset[2];

          if( !options.fixed ) css.top = ( (h - eh) / 2 ) + $(window).scrollTop() + position_offset[0] - position_offset[2];

        break;
        default:

          var lastChar = position.top.substr(-1);
          if( lastChar === '%' ) {

            css.top = ( ( parseFloat( position.top, 10 ) * h ) / 100 ) + position_offset[0];

          } else {

            css.top = parseFloat( position.top, 10 ) + position_offset[0];

          }

      }

      switch(position.left){

        case'left':

          css.left = 0 + position_offset[3];

        break;

        case'right':

          css.left = w - ew - position_offset[3];

        break;

        case'center':

          css.left = ( ( w - ew ) / 2 ) + position_offset[3] - position_offset[1];

        break;

        default:

          var lastChar = position.left.substr(-1);
          if( lastChar === '%' ) {
            css.left = ( ( parseFloat( position.left, 10 ) * w ) / 100 ) + position_offset[3];
          } else {
            css.left = parseFloat( position.left, 10 ) + position_offset[3];
          }

      }

      if( app.dialog.setColors ){

        var background = options.background || '#fff';
        var opacity = options.opacity || 1;

        css.background = background;

        if( opacity > 0 && opacity < 1 && background !== 'transparent'){

          var rgb = app.fn.hexToRgb(background);
          if(rgb) background =  'rgba('+rgb.join(',')+','+opacity+')';

          css.background = background;

        }

      }

      //var ch = h - parseFloat(elem.find('.dialog-title').outerHeight(),10)  - parseFloat(elem.find('.dialog-footer').outerHeight(),10);

      //elem.find('.dialog-data').css({maxHeight:ch});

      if(autoZIndex) _getZindex();

      elem.css(css);
    };

    function _showOverlay(){

      var elem = $('#dialog-' + options.id);

      var background = '#fff';//options.overlayBackground;
      var opacity = options.overlayOpacity;

      if( opacity > 0 && opacity < 1 && background !== 'transparent' ){

        var rgb = app.fn.hexToRgb(background);
        if(rgb) background =  'rgba('+rgb.join(',')+','+opacity+')';

      }

      if( !$('#dialog-overlay-'+options.id).length )  $('body').append('<div class="dialog-overlay" id="dialog-overlay-'+options.id+'"></div>');

      $('#dialog-overlay-'+options.id).css({
        background : background,
        display : 'block',
        'z-index' : zIndex++
      });

    };

    function _hideOverlay(callback){

      if( $('#dialog-overlay-' + options.id).length ){

        var elem_overlay = $('#dialog-overlay-' + options.id);

        if( options.overlayTransition === 'fade' ){

          elem_overlay.fadeOut(options.overlayTransitionSpeed,function(){

            elem_overlay.remove();

            if( typeof callback === 'function' ) callback();

          });

        } else {

          elem_overlay.remove();

          if( typeof callback === 'function' ) callback();

        }

      } else {

        if( typeof callback === 'function' ) callback();

      }

    };

    function _getZindex(){

      var highest = -999;

      $("body *").each(function() {
        var current = parseInt($(this).css("z-index"), 10);
        if(current && highest < current) highest = current;
      });

      return highest;

    };

    return {

      reposition : function(){

        _position(0);

      },

      close : function( onBeforeClose, onClose ){

        var elem = $('#dialog-' + options.id);

        if( elem.length ){

          if( typeof( options.onBeforeClose ) === 'function') options.onBeforeClose();
          if( typeof( onBeforeClose ) === 'function') onBeforeClose();

          if( options.overlayTransition !== 'none' ){

            _hideOverlay(function(){

              elem.hide();

              if( typeof( options.onClose ) === 'function' ) options.onClose();
              if( typeof( onClose ) === 'function' ) onClose();


            });

          } else {

            _hideOverlay();

            elem.hide();

            if( typeof( options.onClose ) === 'function' ) options.onClose();
            if( typeof( onClose ) === 'function' ) onClose();

          }

        }

        if( !$('.dialog:visible').length ) $('body').css( 'overflow-y', 'visible' );

      },

    }

  }),

  stack : {},

  open : function( id, obj ){

    this.stack[id] = new this.load( id, obj );

  },

  close : function( id, onBeforeClose, onClose ){

    if( this.stack[id] ) this.stack[id].close( onBeforeClose, onClose );

  },

  reposition : function(){

    var stack = this.stack;

    $('.dialog:visible').each(function(){

      var id = this.id.substr(7);

      if( stack[id] ) stack[id].reposition();

    });

  },

  center : function(id){

    if( this.stack[id] ) this.stack[id].reposition();

  },


};

//Requires jQuery
//TODO: remove jQuery
'use strict';
app.alert = {

  selector : 'alerts',

  set: function(obj, onBeforeShow, onShow){

    var options = {

      msg : 'msg',
      type : 'error',
      id: 'alert-'+Math.random().toString(36).substring(7),
      dismissable: true,
      auto_dismissable: false,
      auto_dismissable_after: 3000,
      on_before_dismiss: null,
      on_dismiss: null,

    };

    Object.assign(options,obj);

    var type = (typeof type !== 'undefined') ?  type : 'warning';
    var id = (typeof id !== 'undefined') ?  id : 'alert-'+Math.random().toString(36).substring(7);

    var html = '<div'+(options.id!==''?' id="'+options.id+'"':'')+' class="alert '+options.type+'"><div class="alert-icon"></div><span class="alert-text">'+options.msg+'</span>';
    if( options.dismissable ){
      html +='<span class="alert-close"><i class="bi bi-x-lg"></i></span>';
      //html +='&nbsp;<span class="alert-close"><i class="bi bi-x-lg"></i></span>';
    }

    html +='</div>';
    //html +='<div class="clearfix"></div>';

    if(typeof onBeforeShow === 'function') onBeforeShow(msg,type,id);

    $('#'+this.selector).prepend(html);

    if( options.auto_dismissable ){

      var first = $('#'+this.selector).children().first();

      setTimeout(function(){

        if( typeof options.on_before_dismiss === 'function' ) options.on_before_dismiss();

        first.fadeOut(function(){

          $(this).remove();

          if( typeof options.on_dismiss === 'function' ) options.on_dismiss();

        });

      }, options.auto_dismissable_after);

    }

    if(typeof onShow === 'function') onShow(msg,type,id);

    return this;

  },

  init : function(){

    $('#'+this.selector).on('click','.alert-close',function(){

      $(this).parent().fadeOut(function(){

          //$(this).next().remove();
          $(this).remove();

      });

    });

  },
  //})(this || {}),

  onTop: function(){

    var zIndex = app.fn.getHighestZIndex();

    $('#'+this.selector).parent().css('z-index',++zIndex);

  },


};

app.alert.init();

app.cache = {

  type : 'localStorage',

  supported : false,

  key : 'app',

  obj : {},

  init : function(){

    this.supported = this.support();

  },

  support: function(){

    try {

      if( this.type === 'localStorage' ) return 'localStorage' in window && window['localStorage'] !== null;

      else if( this.type === 'sessionStorage' ) return 'sessionStorage' in window && window['sessionStorage'] !== null;

    } catch(e) {

      return false;

    }

  },

  save: function (key, value, method){

    if( !this.supported ) return false;

    if( !key ) key = this.key;

    var store_key = this.key+key;

    if( !value ){

      if( key in this.obj ) value = this.obj[key];

      else value = this.obj;

    }

    if( typeof value === 'object' ){

       value = JSON.stringify(value);

    }

    if( !method ){

      method = this.type;

    }

    if( method === 'localStorage' ){

      try {

        return localStorage.setItem(store_key, value);

      } catch(e) {

        //if (isQuotaExceeded(e)) {
          // Storage full, maybe notify user or do some clean-up
        //}

        return false;

      }

    } else if( method === 'sessionStorage' ) {

      try {

        return sessionStorage.setItem(store_key, value);

      } catch(e) {

        //if (isQuotaExceeded(e)) {
          // Storage full, maybe notify user or do some clean-up
        //}

        return false;

      }

    }

  },

  get: function (key, method){

    if( !this.supported ) return false;

    if( !key ) var stored_key = this.key;
    else {

      var stored_key = this.key+key;

    }

    if( !method ){

      method = this.type;

    }

    if( method === 'localStorage' ) return localStorage.getItem(stored_key);

    else if( method === 'sessionStorage' ) return sessionStorage.getItem(stored_key);

  },

  remove: function (key, method){

    if( !this.supported ) return false;

    if( !key ) var stored_key = this.key;
    else {

      var stored_key = this.key+key;

    }

    if( !method ){

      method = this.type;

    }

    if( method === 'localStorage' ) return localStorage.removeItem(stored_key);

    else if( method === 'sessionStorage' ) return sessionStorage.removeItem(stored_key);

  },

  clear: function (method){

    if( !this.supported ) return false;

    if( !method ){

      method = this.type;

    }

    if( method === 'localStorage' ) return localStorage.clear();

    else if( method === 'sessionStorage' ) return sessionStorage.clear();

  },

  load : function(key, method){

    if(!this.supported) return false;

    if( !key ) key = this.key;

    var cache = app.cache.get(key,method);

    if( cache ){

      this.obj[key] = JSON.parse(cache);

    }

  },

  isQuotaExceeded : function(e) {

    var quotaExceeded = false;

    if (e) {

      if (e.code) {

        switch (e.code) {

          case 22:

            quotaExceeded = true;

          break;

          case 1014:

            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {

              quotaExceeded = true;

            }

          break;

        }

      } else if (e.number === -2147024882) {

        // Internet Explorer 8
        quotaExceeded = true;

      }

    }

    return quotaExceeded;

  }

};

app.fn = {

  generate : {

    randomDigits : function(length) {

      if( !length ) length = 10;

      return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));

    },

    randomInt : function(min, max) {

      return Math.floor(Math.random() * (max - min + 1)) + min;

    },


  },


  on : function(object, type, callback) {

    if (object == null || typeof(object) == 'undefined') return;

    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }

  },

  off : function(el, eventName, eventHandler) {

    el.removeEventListener(eventName, eventHandler);

  },

  addEvent : function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
  },

  is_empty : function(obj) {

    if (obj == null) return true;
    if (obj.length && obj.length > 0) return false;
    if (obj.length === 0) return true;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;

  },

  isTouchDevice : function(){//DEPRECATED USE is.touchDevice
    return !!('ontouchstart' in window || ( window.DocumentTouch && document instanceof DocumentTouch));
  },

  //Returns true if it is a DOM node
  isNode : function(o){//DEPRECATED USE is.node
    return (
      typeof Node === "object" ? o instanceof Node :
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  },

  //Returns true if it is a DOM element
  isElement : function (o){//DEPRECATED USE is.element
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  },

  inViewport : function($el) {
    var elH = $el.outerHeight(),
        H   = $(window).height(),
        r   = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
    return Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H));
  },

  autoChange : function(callback,interval){

    setTimeout(callback, interval || 1000);

  },

  getHighestZIndex: function(){

    var highest = -999;

    $("body *").each(function() {
        var current = parseInt($(this).css("z-index"), 10);
        if(current && highest < current) highest = current;
    });

    return highest;

  },

  hexToRgb: function(hex,opacity) {

    hex = hex.replace(/[^0-9A-F]/gi, '');


    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;

      //if(opacity && opacity === 1) return [r, g, b].join();
      //else return [r, g, b, opacity].join();
  },

  serializeObject : function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  executeFunctionByName: function(functionName, context /*, args */) {

    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }

    return context[func].apply(this, args);

  },

  nl2br : function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
  },


  format : {

    units : {
      years:[31536000,'year','years'],
      months:[2628000,'month','months'],
      weeks:[604800,'week','weeks'],
      days:[86400,'day','days'],
      hours:[3600,'hour','hours'],
      mins:[60,'min','mins'],
      secs:[1,'sec','secs']
    },

    seconds:function(msecs,msecs_display,start,end){

      if(msecs===0) return '0 '+this.units.secs[2];
      if(msecs_display){

        if(msecs<1000) return msecs+' ms';

      }else{

        if(msecs<1000) return '0 '+this.units.secs[2];

      }


      var strs=[], ffms=0;

      if(msecs_display){

        var ff=(msecs % 1).toFixed(4);
        if(ff>0) ffms=(ff*1000);

      }

      var secs=msecs/1000, num=0;

      for(var i in this.units){

        if(secs < this.units[i][0] && i!='0secs') continue;

        num = parseInt(secs / this.units[i][0]);
        secs = secs % (this.units[i][0]);

        if(num == 1) strs.push(num+' '+this.units[i][1]);
        else strs.push(num+' '+this.units[i][2]);

      }

      if(secs>0 && secs<1) ffms+=secs*1000;

      if(msecs_display && ffms!==0) strs.push(parseInt(ffms)+' ms');

      return strs.slice(start||0,end||3).join(', ');
      //return strs.join(', ');

    },

    seconds0:function(secs){

      var sec_num = parseInt(secs, 10);

      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      //if (hours   < 10) {hours   = '0'+hours;}
      //if (minutes < 10) {minutes = '0'+minutes;}
      if (seconds < 10) {seconds = '0'+seconds;}

      var time = (hours>0?hours+':':'')+minutes+':'+seconds;

      return time;

    }

  },

  serializeObject : function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  is : {

    email : function( email ){

      var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return filter.test(email);

    },

    //Returns true if it is a DOM node
    node : function(o){
      return (
        typeof Node === "object" ? o instanceof Node :
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
      );
    },

    //Returns true if it is a DOM element
    element : function (o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
      );
    },

    touchDevice : function(){

      return !!('ontouchstart' in window || ( window.DocumentTouch && document instanceof DocumentTouch));

    },

    domain : function(domain){

      var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
      return domain.match(re);

    },

  }


};

app._ = function(str){

    return str;

};


if ( Object.assign === undefined ) {

  ( function () {

    Object.assign = function ( target ) {

      'use strict';

      if ( target === undefined || target === null ) {

        throw new TypeError( 'Cannot convert undefined or null to object' );

      }

      var output = Object( target );

      for ( var index = 1; index < arguments.length; index ++ ) {

        var source = arguments[ index ];

        if ( source !== undefined && source !== null ) {

          for ( var nextKey in source ) {

            if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

              output[ nextKey ] = source[ nextKey ];

            }

          }

        }

      }

      return output;

    };

  } )();

}

app.u = function(category, queryParts){

    var ts = '';

    if(vars.trailing_slash){

      if(category!=='') ts = '/';

    }

    if(queryParts && queryParts !== ''){

      if(queryParts.charAt(0) !== '/') queryParts = '/'+queryParts;

    }

    return vars.paths.websiteLanguage+category+(queryParts||'')+ts;

};
