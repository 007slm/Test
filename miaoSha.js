var MiaoSha = function () {
    //团购产品frameId to urls 映射数组
    this.itemModelCollection = {};
};

MiaoSha.prototype.enableJQuery = function (loadedCallback) {
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
    var me = this;
    oScript.onload = oScript.onreadystatechange = function () {
        if (!oScript.readyState || (oScript.readyState && oScript.readyState == 'loaded')) {
            jQuery.noConflict();
            if (loadedCallback && typeof loadedCallback === 'function') {
                loadedCallback.apply(me);
            }
        }
    }
    oHead.appendChild(oScript);
};

MiaoSha.prototype.extendAblityByUrl = function (orginIframe, loadedCallback, url) {
    var oHead = orginIframe.getElementsByTagName('HEAD').item(0);
    var oScript = orginIframe.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = url;
    var me = this;
    oScript.onload = oScript.onreadystatechange = function () {
        if (!oScript.readyState || (oScript.readyState && oScript.readyState == 'loaded')) {
            loadedCallback.apply(me);
        }
    }
    oHead.appendChild(oScript);
};


MiaoSha.prototype.joinTuan = function (iframe) {
    //点击参团
    var joinTuan = jQuery(iframe).find('a.J_BuySubmit[title="参团"]');
    joinTuan.each(function () {
        this.click();
    });
    //当下一步出来的时候 点击下一步
    var orginOpen = iframe.open;
    this.extendAblityByUrl(iframe, function () {
        var me = this;
        var oldUrl = iframe.location.href;
        var interval = setInterval(function () {
            try {
                var newUrl = iframe.location.href;
                if (oldUrl === newUrl) {
                    jQuery(iframe).find('div.ju-popup.pop-ju:visible').find('.ft').find('.check').trigger('click');
                    //var thisInterval = me.itemModelCollection[oldUrl]['intervalNum']
                    //clearInterval(thisInterval);
                    //console.log('清除'+thisInterval+"["+newUrl+"]");
                } else {
                    //console.warn('没有清楚掉呀！newUrl:'+newUrl+'oldUrl:'+oldUrl);
                    console.warn('搞定一个');
                }
            } catch (e) {
            }
        }, 10);
        console.log('添加' + interval + "到frame[" + oldUrl + "]");

    }, 'https://raw.github.com/007slm/Test/master/overwriteOpen.js');

};


MiaoSha.prototype.immediatelyBuy = function (iframe,byClick) {
    // <a href="#" data-addfastbuy="true" title="点击此按钮，到下一步确认购买信息。" class="J_ClickCatcher J_LinkBuy">立即购买<b class="J_ClickCatcher J_LinkBuy"></b></a>
    //点击立即购买
    if(byClick == true){
        debugger;
        var me = this;
         var bugItem = jQuery(iframe).find('.J_ClickCatcher').find('.J_LinkBuy');
         //需要给form增加target
         var buyNowForm =  jQuery(iframe).find('#J_FrmBid');
         var frameName = iframe.frameName +'buyNow';
         buyNowForm.attr('target',frameName);
         var buyIframe =jQuery("<iframe src='about:blank' id='"+frameName+"' name='"+frameName+"' width='100%' height='800px' style='border:10px solid red;'></iframe>").appendTo(jQuery(iframe).find('body'))
         var loadCount = 0;
         buyIframe.bind('load', function () {
             loadCount++;
            if(loadCount == 1){
                jQuery(iframe).find('body').children().not('#'+frameName).hide();
                me.submitOrder(this.contentDocument);
             }
         });
         bugItem.each(function () {
            this.click();
         });
    }else{
        debugger;
        var buyNowForm = jQuery(iframe).find('#J_FrmBid');
        buyNowForm.submit();
    }


}


MiaoSha.prototype.submitOrder = function (iframe) {
    //<a id="J_Go" class="btn-go" data-point-url="http://log.mmstat.com/buy.1.2" tabindex="0" title="点击此按钮，提交订单。">提交订单<b class="dpl-button"></b></a>
    //点击提交订单
    if(jQuery(iframe).find('#J_FrmBid').length > 0){
        me.immediatelyBuy(iframe,true);
    }
    var submitOrder = jQuery(iframe).find('#J_Go');
    submitOrder.each(function () {
        this.click();
    });
}

MiaoSha.prototype.waitForComing = function () {
    var me = this;
    this.enableJQuery(function () {
        debugger;
        var countDownerId = 'countDownDiv';
        jQuery('body').append(jQuery('<div style="left: 0px;right: 0px;position:fixed;top:0;margin:auto;height:100px;width:400px;background-color: green;display:block;z-index: 999;" id="countDownDiv"><div id="configDiv">              我要秒杀的宝贝是：              5月[<select id="miaoDate"><option value ="06">6</option><option value ="07">7</option><option value="08">8</option><option value="09">测试</option></select>              ]日，[<select id="miaoHour"><option value ="08">08</option><option value ="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option></select>              ]点，第[<select id="miaoIndex"><option value ="0">1</option><option value ="1">2</option><option value="2">3</option></select>              ]个宝贝。<br/>              修正的误差为:<input id="miaoWucha" type="text" value="02"/></div><button value="开始秒。。。" id="beginToMiao">开始秒。。。</button></div>'));
        jQuery('#' + countDownerId).fadeIn("slow");
        jQuery('#beginToMiao').bind('click', function () {
            debugger;
            me.miaoDate = jQuery('#miaoDate').val();
            me.miaoHour = jQuery('#miaoHour').val();
            me.miaoIndex = jQuery('#miaoIndex').val();
            me.miaoWucha = jQuery('#miaoWucha').val();
            me.countDowner(countDownerId);
        });


    });
}

MiaoSha.prototype.countDowner = function (id) {
    var miaoTime = new Date('2013', '04', this.miaoDate, this.miaoHour).getTime();
    var clock = document.getElementById(id);
    var me = this;
    var count = 1000;
    function showRemainTime() {
        var time = miaoTime - new Date().getTime();
        if (me.miaoDate == 09) {
            time = count--;
        }
        if (time < me.miaoWucha) {
            me.beginMiaoSha();
        } else {
            clock.innerHTML = "距离" + me.miaoDate + "号" + me.miaoHour + "点，第" + me.miaoIndex + "个宝贝,误差[" + me.miaoWucha + "]秒杀开始还有:" + time;
            setTimeout(function () {
                showRemainTime();
            }, 1);
        }
    };
    showRemainTime();
}


MiaoSha.prototype.beginMiaoSha = function () {
    debugger;
    var me = this;
    //jQuery('#info2').find('a.link-box').each(function(){  0.88的获取方案
    var miaoContent = "";
    if (this.miaoDate == "06") {
        miaoContent = "info0";
    } else if (this.miaoDate == "07") {
        miaoContent = "info1";
    } else if (this.miaoDate == "08") {
        miaoContent = "info2";
    } else if (this.miaoDate == "09") {
        miaoContent = "content";
    }

    jQuery('#' + miaoContent + ' .ju-itemlist').find('a.link-box').each(function (index) {
        var itemIndex = index % 3;
        var itemHourIndex = parseInt(index / 3) + 8;
        if (itemIndex == me.miaoIndex && itemHourIndex == parseInt(me.miaoHour)) {
            var urlFrameMapping = {};
            var frameId = 'frame' + index;
            var frameUrl = jQuery(this).attr('href');
            urlFrameMapping.url = frameUrl;
            urlFrameMapping.id = frameId;
            me.itemModelCollection[frameUrl] = urlFrameMapping;
        }
    });
    jQuery('body').children().remove();
    document.domain = 'taobao.com';
    // 每次秒杀东西只有三个
    var limit = 1;
    jQuery.each(me.itemModelCollection, function (frameUrl) {
        limit--;
        if (limit >= 0) {
            var itemIfram = jQuery("<iframe src='<html></html>' id='" + this['id'] + "' name='" + this['id'] + "' width='100%' height='800px' style='display: inline-block'></iframe>").appendTo('body');
            var urlChange = 0;
            itemIfram.bind('load', function () {
                urlChange++;
                //第一次创建iframe后在jframe中参团
                if (urlChange == 1) {
                    me.joinTuan(this.contentDocument);
                } else if (urlChange == 2) {
                    debugger;
                    try{
                        this.contentDocument.frameName = jQuery(this).attr('name');
                    }catch(e){
                        document.domain = 'tmall.com';
                        this.contentDocument.frameName = jQuery(this).attr('name');
                    }

                    me.immediatelyBuy(this.contentDocument);
                } else if (urlChange == 3) {
                    me.submitOrder(this.contentDocument);
                }
            });
            debugger;
            itemIfram.attr("src", this['url']);
        }

    });
};
new MiaoSha().waitForComing();








