/**
 * dialog弹出层组件
 * 支持confirm, alert及普通弹出层
 * @author zhangchen2397@126.com
 * --------------------------------------
 *
 * 对外调用接口及自定义事件
 * @method show 显示弹出层
 * @method hide 关闭弹出层
 * @method setPos 设置弹出层位置
 * @customEvent beforeShow 显示弹出层前派发事件
 * @customEvent afterShow 显示弹出层后派发事件
 * @customEvent beforeHide 关闭弹出层前派发事件
 * @customEvent afterHide 关闭弹出层后派发事件
 *
 */

( function( root, factory ) {
    if ( typeof define === 'function' ) {
        define( 'infiniteScrollPage', [ 'jqmobi' ], function( $ ) {
            return factory( root, $ );
        } );
    } else {
        root.dialog = factory( root, root.$ );
    }
} )( window, function( root, $ ) {
    var tpl = {
        mask: '<div class="dialog-mask"></div>',
        dialog: [
            '<div class="#{dialogClass}" id="#{dialogId}">',
                '<div class="hd">',
                    '<span class="close">X</span>',
                    '#{title}',
                '</div>',
                '<div class="bd">#{content}</div>',
                '<div class="ft">',
                    '<span class="btn btn-ok">#{btnOk}</span>',
                    '<span class="btn btn-cancel">#{btnCancel}</span>',
                '</div>',
            '</div>'
        ].join( '' )
    };

    //用于记录同一页面中实例化dialog次数
    var insCounter = 0;

    var dialog = function( config ) {
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

        this.config = $.extend( this.defaultConfig, config || {} );
        this.config.dialogId += '-' + $.uuid();

        insCounter++;
        this.init.call( this );
    };

    $.extend( dialog.prototype, {
        init: function() {
            var me = this,
                config = this.config;

            //如已初始化则不再创建dom及事件绑定
            if ( !this.hasInit ) {
                this.hasInit = true;
                this._createDom();
                this._cacheDom();
                this._initEvent();
            }

            this.setPos();
            this.hide();
            config.autoShow && this.show();
        },

        _createDom: function() {
            var me = this,
                config = this.config,
                bodyEl = $( document.body );

            //如页面中多次实例dialog组件，只在首次实例时创建mask层
            if ( insCounter < 2 ) {
                bodyEl.append( tpl.mask );
            }
            
            bodyEl.append( this.format( tpl.dialog, config ) );
        },

        _cacheDom: function() {
            var me = this,
                config = this.config,
                el = null;

            this.el = $( '#' + config.dialogId );
            el = this.el;

            this.hd = el.find( '.hd' );
            this.bd = el.find( '.bd' );
            this.ft = el.find( '.ft' );

            this.closeBtn = el.find( '.close' );
            this.mask = $( '.dialog-mask' );

            this.btnOk = el.find( '.btn-ok' );
            this.btnCancel = el.find( '.btn-cancel' );

            //根据dialog类型，隐藏相应按钮
            if ( config.type == 'alert' ) {
                this.btnCancel.hide();
            } else if ( config.type == 'normal' ) {
                this.ft.hide();
            }

            !config.title && this.hd.hide();
            !config.showCloseBtn && this.closeBtn.hide();
        },

        _initEvent: function() {
            var me = this,
                config = this.config,
                clickBtnOkCb = config.clickBtnOkCb ? config.clickBtnOkCb : this.hide,
                clickBtnCancelCb = config.clickBtnCancelCb ? config.clickBtnCancelCb : this.hide;

            this.btnOk.bind( 'click', $.proxy( clickBtnOkCb, this ) );
            this.btnCancel.bind( 'click', $.proxy( clickBtnCancelCb, this ) );
            this.closeBtn.bind( 'click', $.proxy( this.hide, this ) );
            $( window ).bind( 'resize', $.proxy( this.setPos, this ) );
            $( window ).bind( 'orientationchange', $.proxy( this.setPos, this ) );
        },

        show: function() {
            $.trigger( this, 'beforeShow' );

            this.mask.show();
            this.el.show();

            $.trigger( this, 'afterShow' );

            return this;
        },

        hide: function() {
            $.trigger( this, 'aftershow' );

            this.mask.hide();
            this.el.hide();

            $.trigger( this, 'afterHide' );

            return this;
        },

        setPos: function() {
            var me = this,
                config = this.config,
                totalHeight = $( window ).height(),
                clientHeight = $( window ).height(),
                clientWidth = $( window ).width(),
                elHeight = this.el.height(),
                elWidth = this.el.width();

            if ( config.showMask ) {
                this.mask.css( 'height', totalHeight + 'px' );
            }

            this.el.css( {
                'top': ( clientHeight - elHeight ) / 2 + 'px',
                'left': ( clientWidth - elWidth ) / 2 + 'px',
            } );

            return this;
        },

        /**
         * @describe 简单的字符串替换，没有详细测试
         * @para sourse {string} 替换前字串，界定符为#{}将被替换
         * @para data {object} 替换的数据对象
         * @return 替换后的字符串
         */
        format: function( source, data ) {
            source = String( source ); 

            return source.replace( /#\{(.+?)\}/g, function ( match, key ) {
                var replacer = data[ key ];
                return ( 'undefined' == typeof replacer ? '' : replacer );
            } );

            return source;
        }
    } );

    return {
        //需要通过new关键字实例出一个dialog使用
        dialog: dialog,

        //直接通过函数调用，内部处理实例过程
        createDialog: function( config ) {
            return new dialog( config );
        },

        //快捷创建一个confirm dialog
        createConfirmDialog: function( config ) {
            config.type = 'confirm';
            return new dialog( config );
        },

        //快捷创建一个alert dialog
        createAlertDialog: function( config ) {
            config.type = 'alert';
            return new dialog( config );
        },

        //快捷创建一个noraml dialog
        createNormalDialog: function( config ) {
            config.type = 'normal';
            return new dialog( config );
        }
    };
} );
