!function(a,b){if("function"==typeof define&&define.amd)define(["exports","module"],b);else if("undefined"!=typeof exports&&"undefined"!=typeof module)b(exports,module);else{var c={exports:{}};b(c.exports,c),a.autosize=c.exports}}(this,function(a,b){"use strict";function c(a){function b(){var b=window.getComputedStyle(a,null);"vertical"===b.resize?a.style.resize="none":"both"===b.resize&&(a.style.resize="horizontal"),i="content-box"===b.boxSizing?-(parseFloat(b.paddingTop)+parseFloat(b.paddingBottom)):parseFloat(b.borderTopWidth)+parseFloat(b.borderBottomWidth),isNaN(i)&&(i=0),h()}function c(b){var c=a.style.width;a.style.width="0px",a.offsetWidth,a.style.width=c,a.style.overflowY=b,e()}function d(a){for(var b=[];a&&a.parentNode&&a.parentNode instanceof Element;)a.parentNode.scrollTop&&b.push({node:a.parentNode,scrollTop:a.parentNode.scrollTop}),a=a.parentNode;return b}function e(){var b=a.style.height,c=d(a),e=document.documentElement&&document.documentElement.scrollTop;a.style.height="auto";var f=a.scrollHeight+i;return 0===a.scrollHeight?void(a.style.height=b):(a.style.height=f+"px",j=a.clientWidth,c.forEach(function(a){a.node.scrollTop=a.scrollTop}),void(e&&(document.documentElement.scrollTop=e)))}function h(){e();var b=window.getComputedStyle(a,null),d=Math.round(parseFloat(b.height)),f=Math.round(parseFloat(a.style.height));if(d!==f?"visible"!==b.overflowY&&c("visible"):"hidden"!==b.overflowY&&c("hidden"),k!==d){k=d;var h=g("autosize:resized");a.dispatchEvent(h)}}if(a&&a.nodeName&&"TEXTAREA"===a.nodeName&&!f.has(a)){var i=null,j=a.clientWidth,k=null,l=function(){a.clientWidth!==j&&h()},m=function(b){window.removeEventListener("resize",l,!1),a.removeEventListener("input",h,!1),a.removeEventListener("keyup",h,!1),a.removeEventListener("autosize:destroy",m,!1),a.removeEventListener("autosize:update",h,!1),f.delete(a),Object.keys(b).forEach(function(c){a.style[c]=b[c]})}.bind(a,{height:a.style.height,resize:a.style.resize,overflowY:a.style.overflowY,overflowX:a.style.overflowX,wordWrap:a.style.wordWrap});a.addEventListener("autosize:destroy",m,!1),"onpropertychange"in a&&"oninput"in a&&a.addEventListener("keyup",h,!1),window.addEventListener("resize",l,!1),a.addEventListener("input",h,!1),a.addEventListener("autosize:update",h,!1),f.add(a),a.style.overflowX="hidden",a.style.wordWrap="break-word",b()}}function d(a){if(a&&a.nodeName&&"TEXTAREA"===a.nodeName){var b=g("autosize:destroy");a.dispatchEvent(b)}}function e(a){if(a&&a.nodeName&&"TEXTAREA"===a.nodeName){var b=g("autosize:update");a.dispatchEvent(b)}}var f="function"==typeof Set?new Set:function(){var a=[];return{has:function(b){return Boolean(a.indexOf(b)>-1)},add:function(b){a.push(b)},delete:function(b){a.splice(a.indexOf(b),1)}}}(),g=function(a){return new Event(a)};try{new Event("test")}catch(a){g=function(a){var b=document.createEvent("Event");return b.initEvent(a,!0,!1),b}}var h=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(h=function(a){return a},h.destroy=function(a){return a},h.update=function(a){return a}):(h=function(a,b){return a&&Array.prototype.forEach.call(a.length?a:[a],function(a){return c(a,b)}),a},h.destroy=function(a){return a&&Array.prototype.forEach.call(a.length?a:[a],d),a},h.update=function(a){return a&&Array.prototype.forEach.call(a.length?a:[a],e),a}),b.exports=h}),function(){"use strict";function a(b,c,d){return("string"==typeof c?c:c.toString()).replace(b.define||f,function(a,c,e,f){return 0===c.indexOf("def.")&&(c=c.substring(4)),c in d||(":"===e?(b.defineParams&&f.replace(b.defineParams,function(a,b,e){d[c]={arg:b,text:e}}),c in d||(d[c]=f)):new Function("def","def['"+c+"']="+f)(d)),""}).replace(b.use||f,function(c,e){b.useParams&&(e=e.replace(b.useParams,function(a,b,c,e){if(d[c]&&d[c].arg&&e){var f=(c+":"+e).replace(/'|\\/g,"_");return d.__exp=d.__exp||{},d.__exp[f]=d[c].text.replace(new RegExp("(^|[^\\w$])"+d[c].arg+"([^\\w$])","g"),"$1"+e+"$2"),b+"def.__exp['"+f+"']"}}));var f=new Function("def","return "+e)(d);return f?a(b,f,d):f})}function b(a){return a.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var c,d={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};d.encodeHTMLSource=function(a){var b={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},c=a?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(a){return a?a.toString().replace(c,function(a){return b[a]||a}):""}},c=function(){return this||(0,eval)("this")}(),"undefined"!=typeof module&&module.exports?module.exports=d:"function"==typeof define&&define.amd?define(function(){return d}):c.doT=d;var e={append:{start:"'+(",end:")+'",startencode:"'+encodeHTML("},split:{start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("}},f=/$^/;d.template=function(g,h,i){h=h||d.templateSettings;var j,k,l=h.append?e.append:e.split,m=0,n=h.use||h.define?a(h,g,i||{}):g;n=("var out='"+(h.strip?n.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):n).replace(/'|\\/g,"\\$&").replace(h.interpolate||f,function(a,c){return l.start+b(c)+l.end}).replace(h.encode||f,function(a,c){return j=!0,l.startencode+b(c)+l.end}).replace(h.conditional||f,function(a,c,d){return c?d?"';}else if("+b(d)+"){out+='":"';}else{out+='":d?"';if("+b(d)+"){out+='":"';}out+='"}).replace(h.iterate||f,function(a,c,d,e){return c?(m+=1,k=e||"i"+m,c=b(c),"';var arr"+m+"="+c+";if(arr"+m+"){var "+d+","+k+"=-1,l"+m+"=arr"+m+".length-1;while("+k+"<l"+m+"){"+d+"=arr"+m+"["+k+"+=1];out+='"):"';} } out+='"}).replace(h.evaluate||f,function(a,c){return"';"+b(c)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),j&&(h.selfcontained||!c||c._encodeHTML||(c._encodeHTML=d.encodeHTMLSource(h.doNotSkipEncoded)),n="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+d.encodeHTMLSource.toString()+"("+(h.doNotSkipEncoded||"")+"));"+n);try{return new Function(h.varname,n)}catch(a){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+n),a}},d.compile=function(a,b){return d.template(a,null,b)}}(),function(a){if("function"==typeof define&&define.amd)define(a);else if("object"==typeof exports)module.exports=a();else{var b=window.Cookies,c=window.Cookies=a();c.noConflict=function(){return window.Cookies=b,c}}}(function(){function a(){for(var a=0,b={};a<arguments.length;a++){var c=arguments[a];for(var d in c)b[d]=c[d]}return b}function b(c){function d(b,e,f){var g;if("undefined"!=typeof document){if(arguments.length>1){if(f=a({path:"/"},d.defaults,f),"number"==typeof f.expires){var h=new Date;h.setMilliseconds(h.getMilliseconds()+864e5*f.expires),f.expires=h}try{g=JSON.stringify(e),/^[\{\[]/.test(g)&&(e=g)}catch(a){}return e=c.write?c.write(e,b):encodeURIComponent(String(e)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),b=encodeURIComponent(String(b)),b=b.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),b=b.replace(/[\(\)]/g,escape),document.cookie=[b,"=",e,f.expires&&"; expires="+f.expires.toUTCString(),f.path&&"; path="+f.path,f.domain&&"; domain="+f.domain,f.secure?"; secure":""].join("")}b||(g={});for(var i=document.cookie?document.cookie.split("; "):[],j=/(%[0-9A-Z]{2})+/g,k=0;k<i.length;k++){var l=i[k].split("="),m=l.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{var n=l[0].replace(j,decodeURIComponent);if(m=c.read?c.read(m,n):c(m,n)||m.replace(j,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(b===n){g=m;break}b||(g[n]=m)}catch(a){}}return g}}return d.set=d,d.get=function(a){return d(a)},d.getJSON=function(){return d.apply({json:!0},[].slice.call(arguments))},d.defaults={},d.remove=function(b,c){d(b,"",a(c,{expires:-1}))},d.withConverter=b,d}return b(function(){})}),function(a,b){if("function"==typeof define&&define.amd)define(["exports","jquery"],function(a,c){return b(a,c)});else if("undefined"!=typeof exports){var c=require("jquery");b(exports,c)}else b(a,a.jQuery||a.Zepto||a.ender||a.$)}(this,function(a,b){function c(a,c){function e(a,b,c){return a[b]=c,a}function f(a,b){for(var c,f=a.match(d.key);void 0!==(c=f.pop());)if(d.push.test(c)){var h=g(a.replace(/\[\]$/,""));b=e([],h,b)}else d.fixed.test(c)?b=e([],c,b):d.named.test(c)&&(b=e({},c,b));return b}function g(a){return void 0===n[a]&&(n[a]=0),n[a]++}function h(a){switch(b('[name="'+a.name+'"]',c).attr("type")){case"checkbox":return"on"===a.value||a.value;default:return a.value}}function i(b){if(!d.validate.test(b.name))return this;var c=f(b.name,h(b));return m=a.extend(!0,m,c),this}function j(b){if(!a.isArray(b))throw new Error("formSerializer.addPairs expects an Array");for(var c=0,d=b.length;c<d;c++)this.addPair(b[c]);return this}function k(){return m}function l(){return JSON.stringify(k())}var m={},n={};this.addPair=i,this.addPairs=j,this.serialize=k,this.serializeJSON=l}var d={validate:/^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,key:/[a-z0-9_]+|(?=\[\])/gi,push:/^$/,fixed:/^\d+$/,named:/^[a-z0-9_]+$/i};return c.patterns=d,c.serializeObject=function(){return new c(b,this).addPairs(this.serializeArray()).serialize()},c.serializeJSON=function(){return new c(b,this).addPairs(this.serializeArray()).serializeJSON()},"undefined"!=typeof b.fn&&(b.fn.serializeObject=c.serializeObject,b.fn.serializeJSON=c.serializeJSON),a.FormSerializer=c,c}),function(){var a,b;a=this.jQuery||window.jQuery,b=a(window),a.fn.stick_in_parent=function(c){var d,e,f,g,h,i,j,k,l,m,n,o,p;for(null==c&&(c={}),m=c.sticky_class,g=c.inner_scrolling,l=c.recalc_every,k=c.parent,i=c.offset_top,h=c.spacer,f=c.bottoming,null==i&&(i=0),null==k&&(k=void 0),null==g&&(g=!0),null==m&&(m="is_stuck"),d=a(document),null==f&&(f=!0),j=function(a){var b,c,d;return window.getComputedStyle?(d=a[0],b=window.getComputedStyle(a[0]),c=parseFloat(b.getPropertyValue("width"))+parseFloat(b.getPropertyValue("margin-left"))+parseFloat(b.getPropertyValue("margin-right")),"border-box"!==b.getPropertyValue("box-sizing")&&(c+=parseFloat(b.getPropertyValue("border-left-width"))+parseFloat(b.getPropertyValue("border-right-width"))+parseFloat(b.getPropertyValue("padding-left"))+parseFloat(b.getPropertyValue("padding-right"))),c):a.outerWidth(!0)},n=function(c,e,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C,D,E;if(!c.data("sticky_kit")){if(c.data("sticky_kit",!0),x=d.height(),z=c.parent(),null!=k&&(z=z.closest(k)),!z.length)throw"failed to find stick parent";if(v=!1,t=!1,D=null!=h?h&&c.closest(h):a("<div />"),D&&D.css("position",c.css("position")),A=function(){var a,b,f;if(!s)return x=d.height(),a=parseInt(z.css("border-top-width"),10),b=parseInt(z.css("padding-top"),10),e=parseInt(z.css("padding-bottom"),10),n=z.offset().top+a+b,o=z.height(),v&&(v=!1,t=!1,null==h&&(c.insertAfter(D),D.detach()),c.css({position:"",top:"",width:"",bottom:""}).removeClass(m),f=!0),p=c.offset().top-(parseInt(c.css("margin-top"),10)||0)-i,q=c.outerHeight(!0),r=c.css("float"),D&&D.css({width:j(c),height:q,display:c.css("display"),"vertical-align":c.css("vertical-align"),float:r}),f?E():void 0},A(),q!==o)return w=void 0,y=i,C=l,E=function(){var a,j,k,u,B,E;if(!s)return k=!1,null!=C&&(C-=1,C<=0&&(C=l,A(),k=!0)),k||d.height()===x||(A(),k=!0),u=b.scrollTop(),null!=w&&(j=u-w),w=u,v?(f&&(B=u+q+y>o+n,t&&!B&&(t=!1,c.css({position:"fixed",bottom:"",top:y}).trigger("sticky_kit:unbottom"))),u<p&&(v=!1,y=i,null==h&&("left"!==r&&"right"!==r||c.insertAfter(D),D.detach()),a={position:"",width:"",top:""},c.css(a).removeClass(m).trigger("sticky_kit:unstick")),g&&(E=b.height(),q+i>E&&(t||(y-=j,y=Math.max(E-q,y),y=Math.min(i,y),v&&c.css({top:y+"px"}))))):u>p&&(v=!0,a={position:"fixed",top:y},a.width="border-box"===c.css("box-sizing")?c.outerWidth()+"px":c.width()+"px",c.css(a).addClass(m),null==h&&(c.after(D),"left"!==r&&"right"!==r||D.append(c)),c.trigger("sticky_kit:stick")),v&&f&&(null==B&&(B=u+q+y>o+n),!t&&B)?(t=!0,"static"===z.css("position")&&z.css({position:"relative"}),c.css({position:"absolute",bottom:e,top:"auto"}).trigger("sticky_kit:bottom")):void 0},B=function(){return A(),E()},u=function(){if(s=!0,b.off("touchmove",E),b.off("scroll",E),b.off("resize",B),a(document.body).off("sticky_kit:recalc",B),c.off("sticky_kit:detach",u),c.removeData("sticky_kit"),c.css({position:"",bottom:"",top:"",width:""}),z.position("position",""),v)return null==h&&("left"!==r&&"right"!==r||c.insertAfter(D),D.remove()),c.removeClass(m)},b.on("touchmove",E),b.on("scroll",E),b.on("resize",B),a(document.body).on("sticky_kit:recalc",B),c.on("sticky_kit:detach",u),setTimeout(E,0)}},o=0,p=this.length;o<p;o++)e=this[o],n(a(e));return this}}.call(this),function(a){function b(b){if("string"==typeof b.data&&(b.data={keys:b.data}),b.data&&b.data.keys&&"string"==typeof b.data.keys){var c=b.handler,d=b.data.keys.toLowerCase().split(" ");b.handler=function(b){if(this===b.target||!(a.hotkeys.options.filterInputAcceptingElements&&a.hotkeys.textInputTypes.test(b.target.nodeName)||a.hotkeys.options.filterContentEditable&&a(b.target).attr("contenteditable")||a.hotkeys.options.filterTextInputs&&a.inArray(b.target.type,a.hotkeys.textAcceptingInputTypes)>-1)){var e="keypress"!==b.type&&a.hotkeys.specialKeys[b.which],f=String.fromCharCode(b.which).toLowerCase(),g="",h={};a.each(["alt","ctrl","shift"],function(a,c){b[c+"Key"]&&e!==c&&(g+=c+"+")}),b.metaKey&&!b.ctrlKey&&"meta"!==e&&(g+="meta+"),b.metaKey&&"meta"!==e&&g.indexOf("alt+ctrl+shift+")>-1&&(g=g.replace("alt+ctrl+shift+","hyper+")),e?h[g+e]=!0:(h[g+f]=!0,h[g+a.hotkeys.shiftNums[f]]=!0,"shift+"===g&&(h[a.hotkeys.shiftNums[f]]=!0));for(var i=0,j=d.length;i<j;i++)if(h[d[i]])return c.apply(this,arguments)}}}}a.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",10:"return",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",59:";",61:"=",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},shiftNums:{"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"},textAcceptingInputTypes:["text","password","number","email","url","range","date","month","week","time","datetime","datetime-local","search","color","tel"],textInputTypes:/textarea|input|select/i,options:{filterInputAcceptingElements:!0,filterTextInputs:!0,filterContentEditable:!0}},a.each(["keydown","keyup","keypress"],function(){a.event.special[this]={add:b}})}(jQuery||this.jQuery||window.jQuery),function(a){var b=a({});a.ajaxQueue=function(c){function d(b){e=a.ajax(c),e.done(f.resolve).fail(f.reject).then(b,b)}var e,f=a.Deferred(),g=f.promise();return b.queue(d),g.abort=function(h){if(e)return e.abort(h);var i=b.queue(),j=a.inArray(d,i);return j>-1&&i.splice(j,1),f.rejectWith(c.context||c,[g,h,""]),g},g}}(jQuery),function(){var a=window.JihadCore={$win:$(window),$doc:$(document),$html:$("html"),$body:$("body")};a.blocks={},a.blockRegister=function(b){var c=b.getSelector();return c&&(c in a.blocks?console.log("Selector "+c+" is already registered in other block"):a.blocks[c]=b),this},a.blocksRun=function(b){var c=b||document;return $.each(a.blocks,function(a,b){var d=$(c).filter(a).add($(a,c));d.length&&d.each(function(){b.run($(this))})}),this},a.isDefined=function(a){return null!=a};var b={};a.data=function(a,c){return arguments.length<2?b[a]:void(b[a]=c)},a.throttle=function(a,b){function c(){e=this,f=arguments,g?h=!0:(a.apply(e,f),g=setTimeout(function(){g=null,h&&(h=!1,c.apply(e,f))},b))}function d(){h=!1}var e,f,g=null,h=!1;return c.reset=d,c}}(),function(){var a=window.JihadBlock={};a.getSelector=function(){return null},a.getBindings=function(){return[]},a.isInitialized=function(a){var b=a.data("jihad-initialized");if(b){var c=this.getSelector();if(c in b)return!0}return!1},a.applyBindings=function(a){$.each(this.getBindings(a),function(b,c){a.on.apply(a,c)})},a.initialize=function(a){},a.finalize=function(a){},a.run=function(a){var b=this;$.each(a,function(){var a=$(this);if(!b.isInitialized(a)){var c=a.data("jihad-initialized")||{};c[b.getSelector()]=1,a.data("jihad-initialized",c),b.initialize(a),b.applyBindings(a),b.finalize(a)}})}}(),function(){var a=window.JihadForm={lock:null,lockSelector:null};a.getAction=function(a){return a.attr("action")},a.getMethod=function(a){return a.attr("method")||"POST"},a.getData=function(a){return a.serialize()},a.getLock=function(){return null===this.lock&&(this.lock=this.createLock()),this.lock},a.getLockSelector=function(){return this.lockSelector},a.createLock=function(){return new JihadLock(this.getLockSelector())},a.errorsHide=function(a){a.find('[role="error"]').hide()},a.errorsShow=function(a,b){var c=this;$.each(b,function(b,d){c.errorShow(a,b,d)})},a.errorShow=function(a,b,c){a.find('[role="error"][data-field="'+b+'"]').text(c.message).show()},a.errorGlobal=function(a,b){alert(b.message)},a.beforeSend=function(a){this.submitsDisable(a),this.getLock().lock(a)},a.afterSend=function(a){this.submitsEnable(a),this.getLock().unlock(a)},a.submitsDisable=function(a){a.find('[role="submit"]').prop("disabled",!0)},a.submitsEnable=function(a){a.find('[role="submit"]').prop("disabled",!1)},a.onSuccess=function(a,b,c,d){this.errorsHide(a),b&&b.result?b.result.errors?(a.trigger("jihad-fail",b),this.fail(a,b.result)):(a.trigger("jihad-success",b),this.success(a,b.result)):(a.trigger("jihad-fail",b),this.errorGlobal(a,{message:"Something is wrong"}))},a.onError=function(a,b,c,d){a.trigger("jihad-fail"),this.errorGlobal(a,{message:"Something is wrong"})},a.fail=function(a,b){this.errorsShow(a,b.errors)},a.success=function(a,b){},a.submit=function(a){var b=this,c=$(a);return!this.getLock().isLocked(c)&&($.ajax(this.getAction(c),{beforeSend:function(){b.beforeSend(c)},complete:function(){b.afterSend(c)},dataType:"json",data:this.getData(c),type:this.getMethod(c),success:function(a,d,e){b.onSuccess(c,a,d,e)},error:function(a,d,e){b.onError(c,a,d,e)}}),!1)}}(),function(){window.JihadLock=function(a){this._toggle_selector=a||".js-lock-toggle",this.getToggleSelector=function(a){return this._toggle_selector},this.isLocked=function(a){return!!a.data("jihad-locked")},this.lock=function(a){a.data("jihad-locked",1),this.afterLock(a)},this.afterLock=function(a){a.find(this.getToggleSelector(a)).toggleClass("hidden")},this.unlock=function(a){a.data("jihad-locked",0),this.afterUnlock(a)},this.afterUnlock=function(a){a.find(this.getToggleSelector(a)).toggleClass("hidden")}}}(),function(){var a=window.JihadModal={$active:null,tpl:"modal",preprocess:!0};a.getTpl=function(){return this.tpl},a.getUrl=function(){return null},a.preprocessUrl=function(){var a=this.getUrl();if(a&&this.preprocess){var b=JihadUrl.parse(a,!0);b.pathname+=".json",b.search=b.query,b.search.layouts=["layout_content"],a=JihadUrl.make(b)}return a},a.getData=function(){return{}},a.getMethod=function(){return"POST"},a.beforeSend=function(){},a.afterSend=function(){},a.getActive=function(){return this.$active},a.onSuccess=function(a,b,c){a&&a.result?a.result.errors?this.fail(a.result):(this.successLayout(a.result),this.success(a.result)):this.errorGlobal({message:"Something is wrong"})},a.onError=function(a,b,c){this.errorGlobal({message:"Something is wrong"})},a.fail=function(a){this.errorGlobal({message:"Something is wrong"})},a.success=function(b){a.getActive().modal("show")},a.successLayout=function(b){var c=a.getActive().find(".modal-content");c.html(b.layouts.layout_content)},a.errorGlobal=function(a){alert(a.message)},a.show=function(b){a.getActive()&&a.getActive().remove(),a.$active=JihadTpl.html(this.getTpl(),b||{}),JihadCore.$body.append(a.getActive());var c=this.preprocessUrl();if(c){var d=this;$.ajax(c,{beforeSend:function(){d.beforeSend()},complete:function(){d.afterSend()},dataType:"json",data:this.getData(),type:this.getMethod(),success:function(b,c,e){d.onSuccess(b,c,e),JihadCore.blocksRun(a.getActive())},error:function(a,b,c){d.onError(a,b,c)}})}else this.success({}),JihadCore.blocksRun(a.getActive());return!1},a.hide=function(){a.getActive().modal("hide")}}(),function(){var a=window.JihadRowUpdater={container:null,data:{}};a.id=function(a){return a},a.run=function(){var a=$(this.container),b=this;$.each(this.data,function(c,d){var e=a.find("#"+b.id(c));e.length?d?(e.replaceWith(d),JihadCore.blocksRun(e)):e.remove():a.prepend(d)})}}(),function(){var a=window.JihadTpl={};["evaluate","interpolate","encode","use","define","conditional","iterate"].forEach(function(a){var b=this[a],c=b.source.replace(/\\{\\{/g,"\\[\\[").replace(/\\}\\}/g,"\\]\\]"),d=(b.global?"g":"")+(b.multiline?"m":"")+(b.ignoreCase?"i":"");this[a]=new RegExp(c,d)},doT.templateSettings),a.TPL_PREFIX="tpl-",a.cache={},a.helpers={params:function(a){return JSON.stringify(a)},include:function(b,c){return a.html(b,c)}},a.push=function(b,c){return a.cache[b]=doT.compile(c)},a.get=function(b){var c,d;return b&&(d=a.cache[b],void 0===d&&(c=$("#"+a.TPL_PREFIX+b),d=c.length?a.push(b,c.html().trim()):a.cache[b]=null)),d||null},a.text=function(b,c){var d=a.get(b);return d?d(c||{}):""},a.html=function(b,c){return $(a.text(b,c))}}(),function(){window.JihadUrl=function(a,b){function c(a,b){var c=null;return a&&(a=n(a),c=v.exec(a)),c&&(c={href:a,protocol:c[1],host:c[2]||"",hostname:c[3]||"",port:c[4]||"",pathname:c[5]||"",search:c[6]&&1!==c[6].length?c[6]:"",hash:c[7]&&1!==c[7].length?c[7]:""},c.path=c.pathname+c.search,c.isLocal=f(c),b&&(c.query=e(c.search))),c}function d(a){var b,c,d,e="";return a=a||{},e+=(a.protocol||location.protocol)+"//",e+=a.host?a.host:a.hostname?a.hostname+(a.port?":"+a.port:""):location.host,b=a.pathname,b&&"/"===b.charAt(0)&&(b=b.slice(1)),b&&(e+="/"+b),c=a.search,c&&("string"==typeof c?"?"===c.charAt(0)&&(c=c.slice(1)):c=A(c),c&&(e+="?"+c)),d=e.hash,d&&"#"===d.charAt(0)&&(d=d.slice(1)),d&&(e+="#"+d),e}function e(a){var b={};return a&&"?"===a.charAt(0)&&(a=a.slice(1)),a&&a.split("&").forEach(function(a){var c,d;a=a.split("="),c=B(a[0]),c&&(d=B(a.slice(1).join("=")),b[c]=d)}),b}function f(b){return"string"==typeof b&&(b=c(b)),b&&b.protocol===a.location.protocol&&b.host===a.location.host}function g(){return a.location.pathname+a.location.search}function h(){return i(a.location.href)}function i(a){return a.split("#").slice(1).join("#")}function j(a){return"//"===a.slice(0,2)?a.slice(1):a}function k(a){return"/"===a.charAt(0)?"/"+a:a}function l(b,c){c?a.location.replace("#"+b):a.location.hash=b}function m(a,b){return b?a+"#"+k(b):a}var n,o,p,q,r,s,t,u=/^\w+:\/\//i,v=/^(.+?:)\/\/(?:.+?(?::.+?)?@)?((.+?)(?::(\d+))?)(\/.*?)?(\?.*?)?(#.*)?$/,w=/\+/g,x=!(!a.history||!a.history.pushState),y=b.createElement("a"),z=g(),A=(j(h()),$.param.bind($)),B=function(a){return decodeURIComponent(a.replace(w,"%20"))};return y.href="a","a"===y.href?(p=b.createElement("div"),o=function(a){return p.innerHTML='<a href="'+a.replace(/"/g,"%22")+'"></a>',p.firstChild.href}):o=function(a){return y.href=a,y.href},n=function(a){return a=a||"",u.test(a)?a:o(a)},x?(q=function(a){return null==a?g():c(a).path},r=function(a){return j(null==a?h():i(a))},s=function(c){c?l(k(c),!0):a.history.replaceState({},b.title,g())}):(q=function(a){return null==a&&(a=h()),c(a).path},r=function(a){return null==a&&(a=h()),j(i(a))},s=function(a){l(m(q(),a),!0)}),{toAbsolute:n,parse:c,make:d,parseQuery:e,encodeQuery:A,isLocal:f,reload:function(){a.location.reload()},getPath:function(){return z},getQuery:function(){return c(z,!0).query},getHash:function(){return r()},getUrl:function(){return m(z,r())},getOrigin:function b(d){return d?(d=c(d),d.protocol+"//"+d.host):t=t||a.location.origin||b(a.location.href)},setHash:s}}(window,document)}(),function(){var a={};JihadCore.blockRegister($.extend(a,JihadBlock,{getSelector:function(){return".jh-animation"},getBindings:function(){return[]},initialize:function(b){var c=b.data("type");switch(c){case"rotating-plane":a.initializeRotatingPlane(b);break;case"double-bounce":a.initializeDoubleBounce(b);break;case"wave":a.initializeWave(b);break;case"pulse":a.initializePulse(b);break;case"three-bounce":a.initializeThreeWave(b);break;case"fading-circle":a.initializeFadingCircle(b)}},initializeDoubleBounce:function(a){a.addClass("sk-double-bounce"),a.html(['<div class="sk-child sk-double-bounce1"></div>','<div class="sk-child sk-double-bounce2"></div>'].join(""))},initializeWave:function(a){a.addClass("sk-wave"),a.html(['<div class="sk-rect sk-rect1"></div>','<div class="sk-rect sk-rect2"></div>','<div class="sk-rect sk-rect3"></div>','<div class="sk-rect sk-rect4"></div>','<div class="sk-rect sk-rect5"></div>'].join(""))},initializePulse:function(a){a.addClass("sk-spinner-pulse")},initializeThreeWave:function(a){a.addClass("sk-three-bounce"),a.html(['<div class="sk-child sk-bounce1"></div>','<div class="sk-child sk-bounce2"></div>','<div class="sk-child sk-bounce3"></div>'].join(""))},initializeFadingCircle:function(a){a.addClass("sk-fading-circle"),a.html(['<div class="sk-circle1 sk-circle"></div>','<div class="sk-circle2 sk-circle"></div>','<div class="sk-circle3 sk-circle"></div>','<div class="sk-circle4 sk-circle"></div>','<div class="sk-circle5 sk-circle"></div>','<div class="sk-circle6 sk-circle"></div>','<div class="sk-circle7 sk-circle"></div>','<div class="sk-circle8 sk-circle"></div>','<div class="sk-circle9 sk-circle"></div>','<div class="sk-circle10 sk-circle"></div>','<div class="sk-circle11 sk-circle"></div>','<div class="sk-circle12 sk-circle"></div>'].join(""))},initializeRotatingPlane:function(a){a.addClass("sk-rotating-plane")}}))}(),function(){var a={};JihadCore.blockRegister($.extend(a,JihadBlock,{getSelector:function(){return".jh-list"},initialize:function(a){this._checkDistance=JihadCore.throttle(this._checkDistance.bind(this,a),500),JihadCore.$win.on("load scroll resize",this._checkDistance),this._checkDistance()},getMoreUrl:function(a){var b,c;return this._noMore?null:(b=this.getMoreBtn(a),c=!!b.length,c||(JihadCore.$win.off("load scroll resize",this._checkDistance),this._noMore=!0),c?b.data("more-url"):null)},getMoreBtn:function(a){return a.find(".jh-list__more")},_checkDistance:function(a){var b=new JihadLock(a);if(b.isLocked(a))return!1;var c,d,e=this,f=JihadCore.$win,g=this.getMoreUrl(a);g&&(c=f.scrollTop()+f.height(),d=a.offset().top+a.height(),d-c<1e3&&(b.lock(a),a.addClass("jh-list__loading"),a.find(".jh-list__toggle").toggleClass("jh-list__hidden"),this.getMoreBtn(a).unbind(),$.ajax({url:g,dataType:"json",complete:function(){b.unlock(a)}}).done(function(c){var d,f=c&&c.result||{};e.getMoreBtn(a).remove(),b.unlock(a),a.removeClass("jh-list__loading"),a.find(".jh-list__toggle").toggleClass("jh-list__hidden"),f.html&&(d=$(f.html),a.append(d),JihadCore.blocksRun(d))})))}}))}(),function(){var a={};JihadCore.blockRegister($.extend(a,JihadBlock,{getSelector:function(){return".jh-select"},getBindings:function(){return[["change",".jh-select__control",function(){var a=$(this),b=a.closest(".jh-select"),c=b.find("option:selected");b.find(".jh-select__placeholder").html(c.html());var d=b.find(".jh-select__input");d.length&&d.val(c.attr("value"))}],["focus",".jh-select__control",function(){var a=$(this),b=a.closest(".jh-select");b.toggleClass("focus",!0)}],["blur",".jh-select__control",function(){var a=$(this),b=a.closest(".jh-select");b.toggleClass("focus",!1)}],["click, focus",".jh-select__input",function(){var a=$(this),b=a.closest(".jh-select");b.toggleClass("focus",!0),a.toggleClass("m-filled",!0);var c=parseInt(a.val().replace(/[^0-9]/g,""))||0;0==c&&a.val("")}],["blur",".jh-select__input",function(){var a=$(this),b=a.closest(".jh-select"),c=b.find(".jh-select__placeholder");b.toggleClass("focus",!1),a.toggleClass("m-filled",!1);var d=parseInt(a.val().replace(/[^0-9]/g,""))||0;d==b.data("default-value")?b.toggleClass("m-default-value",!0):b.toggleClass("m-default-value",!1),b.data("default-label")?c.text(JihadTpl.text(b.data("default-label"),{value:d})):c.html("")}]]}}))}(),function(){var a={};JihadCore.blockRegister($.extend(a,JihadBlock,{getSelector:function(){return".jh-stick"},getBindings:function(){return[]},initialize:function(a){a.stick_in_parent(a.data("stick"))}}))}(),function(){var a={};JihadCore.blockRegister($.extend(a,JihadBlock,{getSelector:function(){return".jh-textarea"},getBindings:function(){return[]},initialize:function(a){JihadBlock.initialize(a);var b=a.find("textarea");autosize(b),b.on("keydown",null,"ctrl+return",function(){b.parents("form").submit()})}}))}();