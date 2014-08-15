dialog
======

该dialog组件为针对于移动webapp开发，小巧轻量，对外调用API简单便捷，配置灵活，UI完全自定义。该组件包含常见的confirm弹出层、alert弹出层及自定义弹出层，满足弹出层开发需求。

[先点击查看demo](http://zhangchen2397.github.io/infiniteScrollPage/demo/) (建议扫描下方二维码手机上体验效果更佳)

![qr code](http://zhangchen2397.github.io/infiniteScrollPage/demo/images/qrcode.png)

###组件主要功能
1. 默认定制3种常用的弹出层形式（confirm、alert、normal）
2. 弹出层标题、关闭按钮灵活定制显示隐藏
3. 支持自定义弹出层，满足所有弹出层开发需求
4. 自定义传入窗口class，方便定制UI
5. 同一页面实例多个弹出层时，随机生成容器ID，防止冲突

###配置参数说明
```javascript
this.defaultConfig = {
    /**
     * dialogId {string} dialog外层容器ID
     *  -内部会处理加上$.uuid()，防止同一页面多次实例id冲突
     * dialogClass {string} dialog外层容器class，方便自定义复写样式
     */
    dialogId: 'dialog',
    dialogClass: 'dialog',

    /**
     * type {string} 弹出层类型 confirm | alert | normal
     *  - confirm确定弹层，带有确认及取消按钮
     *  - alert警告弹层，带有确认按钮
     *  - normal一般弹出层，完全自定义，不显示按钮
     */
    type: 'confirm',
    showMask: true,             //是否显示遮罩层
    showCloseBtn: false,        //是否显示关闭按钮
    autoShow: false,            //new实例时是否自动显示dialog

    content: '',                //弹出层主体内容
    title: '',                  //弹出层标题，如为空，则不显示

    btnOk: '确定',              //确定按钮文案
    btnCancel: '取消',          //取消按钮文案

    /**
     * clickBtnOkCb {function} 点击确定按钮时的回调，默认关闭弹层
     * clickBtnCancelCb {function} 点击取消按钮时的回调，默认关闭弹层
     */
    clickBtnOkCb: null,
    clickBtnCancelCb: null
};
```

###对外调用接口及自定义事件
```javascript
/**
 * 对外调用接口及自定义事件
 * @method show 显示弹出层
 * @method hide 关闭弹出层
 * @method setPos 设置弹出层位置
 * @customEvent beforeShow 显示弹出层前派发事件
 * @customEvent afterShow 显示弹出层后派发事件
 * @customEvent beforeHide 关闭弹出层前派发事件
 * @customEvent afterHide 关闭弹出层后派发事件
 */
 ```

###基本html结构 (内部自动创建，无需关心)
```html
<div class="#{dialogClass}" id="#{dialogId}">
    <div class="hd">
        <span class="close">X</span>
        #{title}
    </div>',
    <div class="bd">#{content}</div>
    <div class="ft">
        <span class="btn btn-ok">#{btnOk}</span>
        <span class="btn btn-cancel">#{btnCancel}</span>
    </div>
</div
```

###组件初始化及使用
```javascript
( function() {
    var content = '这里是弹出层的主体内容，可以自定义你想要的标签及内容，方便满足各种样式需求。';

    //初始化confirm弹出层
    var confirmDialog = new dialog.dialog( {
        content: content,
        type: 'confirm',
        title: '这是一个confirm弹出层',
        showCloseBtn: true,
        clickBtnOkCb: function() {
            alert( '这是点击确定按钮的回调，默认为关闭弹出层' );
        },
        clickBtnCancelCb: function() {
            alert( '这是点击取消按钮的回调，默认为关闭弹出层' );
        }
    } );

    //初始化alert弹出层
    var alertDialog = dialog.createAlertDialog( {
        content: content,
        title: '这是一个alert弹出层',
        showCloseBtn: true,
        clickBtnOkCb: function() {
            alert( '这是点击确定按钮的回调，默认为关闭弹出层' );
        }
    } );

    //初始化自定义弹出层
    var normalDialog = dialog.createNormalDialog( {
        content: content,
        title: '这是一个普通弹出层',
        showCloseBtn: true
    } );  

    $( '#confirm-btn' ).bind( 'click', function() {
        confirmDialog.show();
    } );

    $( '#alert-btn' ).bind( 'click', function() {
        alertDialog.show();
    } ); 

    $( '#normal-btn' ).bind( 'click', function() {
        normalDialog.show();
    } );
} )();
```