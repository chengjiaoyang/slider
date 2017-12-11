/*
 * BannerSlider
 * Copyright by Fakin
 * Blog:http://fakin.cn
 **/
window.BannerSlider = (function () {
    function $(id) {
        return document.getElementById(id);
    }

    var banner = function () {
        this.index = 1;
        this.flag = false;
        this.timer = null;
        this.timer2 = null;
    };
    banner.prototype = {
        init: function (obj) {
            this.type = obj.type;//类型
            this.container = $(obj.container);//盒子
            this.list = $(obj.list);//轮播图父级
            this.btn = $(obj.dot);//小圆点
            this.lBtn = $(obj.dirButton[0]);//左按钮
            this.rBtn = $(obj.dirButton[1]);//右按钮
            this.oli = (obj.cNode || 'li') || null;//选择生成补充dom
            this.pCut = obj.pointCut;//小圆点切换开关
            this.aCut = obj.autoCut;//自动切换开关
            this.dotLable = obj.dotLable || 'span';//小圆点标签配置项
            this.dotClass = obj.dotClass || null;//小圆点选中项class
            this.time = obj.time;//运动时间
            this.interval = obj.interval;//运动间隔
            this.bind(obj.type);
        },
        bind: function () {
            var _self = this;
            if (_self.type == 'seamless') {
                /*补充dom,非常关键，不然无法实现无缝切换banner*/
                function createDom() {
                    let caz = _self.list.getElementsByTagName(_self.oli), lnewdom = document.createElement(_self.oli),
                        rnewdom = document.createElement(_self.oli);
                    lnewdom.innerHTML = caz[0].innerHTML;
                    rnewdom.innerHTML = caz[caz.length - 1].innerHTML;
                    _self.list.insertBefore(rnewdom, caz[0]);
                    _self.list.appendChild(lnewdom);
                }

                createDom();
                /*点击轮换*/
                let boxWidth = _self.container.clientWidth;//盒子宽度
                let listnum = _self.container.getElementsByTagName(_self.oli).length - 2;//轮播图个数-2，因为之前已经生成了2个！
                _self.rBtn.onclick = function () {
                    if (_self.flag) {
                        return
                    }
                    if (_self.index == 5) {
                        _self.index = 1
                    } else {
                        _self.index += 1;
                    }
                    if (!_self.flag) {
                        offset(-boxWidth);
                    }
                    showPoint()
                };
                _self.lBtn.onclick = function () {
                    if (_self.flag) {
                        return
                    }
                    if (_self.index == 1) {
                        _self.index = 5
                    } else {
                        _self.index -= 1
                    }
                    if (!_self.flag) {
                        offset(boxWidth);
                    }

                    showPoint()
                };
                /*运动函数*/
                function offset(_offset) {
                    _self.flag = true;
                    let oleft = parseInt(_self.list.style.left) + _offset;
                    let speed = _offset / (_self.time / _self.interval);//每次位移量
                    function move() {
                        if ((speed < 0 && parseInt(_self.list.style.left) > oleft) || (speed > 0 && parseInt(_self.list.style.left) < oleft)) {
                            _self.list.style.left = parseInt(_self.list.style.left) + speed + "px";
                            setTimeout(move, _self.interval)
                        } else {
                            _self.list.style.left = oleft + "px";
                            if (oleft < -boxWidth * listnum) {
                                _self.list.style.left = -boxWidth + 'px'
                            } else if (oleft > -boxWidth) {
                                _self.list.style.left = -3000 + 'px'
                            }
                            _self.flag = false;
                        }
                    }

                    move()
                };
                /*小圆点亮起*/
                function showPoint() {
                    /*选择是否开始小圆点*/
                    let btns = _self.btn ? _self.btn.getElementsByTagName(_self.dotLable) : null;
                    if (btns == null) {
                        return
                    }
                    for (let i = 0; i < btns.length; i++) {
                        if (btns[i].className == _self.dotClass) {
                            btns[i].className = '';
                        }

                    }
                    btns[_self.index - 1].className = _self.dotClass
                };
                /*小圆点切换*/
                function pointCut() {
                    /*选择是否开始小圆点*/
                    let btns = _self.btn ? _self.btn.getElementsByTagName(_self.dotLable) : null;
                    if (!_self.pCut || btns == null) {
                        return
                    }
                    for (let i = 0; i < btns.length; i++) {
                        btns[i].onclick = function () {
                            let myIndex = parseInt(this.getAttribute('index'));
                            let _off = (myIndex - _self.index) * -boxWidth;
                            if (_self.flag) {
                                return
                            }
                            offset(_off);
                            _self.index = myIndex;
                            showPoint()
                        }
                    }
                };
                pointCut();
                /*自动切换*/
                function autoCut() {
                    if (!_self.aCut) {
                        return
                    }
                    let play = function () {
                        _self.timer = setInterval(function () {
                            _self.rBtn.onclick()
                        }, 3000)
                    };
                    play();
                    let stop = function () {
                        clearInterval(_self.timer)
                    };
                    _self.container.onmouseover = stop;
                    _self.container.onmouseout = play;
                };
                autoCut();
            } else if (_self.type == 'ordinary') {

                let oLis = _self.list.getElementsByTagName(_self.oli);
                let oLdots = _self.btn.getElementsByTagName(_self.dotLable);
                var index = 0;
                //小圆点切换
                for (let i = 0; i < oLis.length; i++) {
                    oLdots[i].index = i;
                    oLdots[i].onclick = oLdots[i].onmouseenter = function () {
                        clearInterval(_self.timer);
                        var _this = this;
                        console.log(_this)
                        _self.timer2 = setTimeout(function () {
                            if (_this.className == 'on') {
                                return
                            }
                            oLis[index].style.opacity = 0;
                            oLdots[index].className = '';
                            oLis[index].style.zIndex = 0;
                            index = _this.index;
                            oLdots[index].className = 'on';
                            oLis[index].style.opacity = 1;
                            oLis[index].style.zIndex = 1;
                        }, 300);
                    };
                    oLis[i].onmouseout = function () {
                        clearTimeout(_self.timer2)
                    }
                }
                //虚拟点击
                _self.rBtn.onclick = function () {
                    oLis[index].style.opacity = 0;
                    oLis[index].style.zIndex = 0;
                    oLdots[index].className = '';
                    index == oLis.length - 1 ? index = 0 : index++;
                    oLdots[index].className = _self.dotClass;
                    oLis[index].style.opacity = 1;
                    oLis[index].style.zIndex = 1;
                };
                //自动切换
                _self.timer = setInterval(_self.rBtn.onclick, 3000);
                _self.container.onmouseover = function () {
                    clearInterval(_self.timer)
                };
                _self.container.onmouseout = function () {
                    clearInterval(_self.timer);
                    _self.timer = setInterval(_self.rBtn.onclick, 3000)
                }


            } else {
                return
            }
        }
    };

    return banner
})();









