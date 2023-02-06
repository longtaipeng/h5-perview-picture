window.onload = function() {
    // 获取窗口可视高度和宽度
    var win_preview_height = getClientHeight();
    // 获取所有图片信息
    var picture_list = [];
    $(".picture_item").each((index, item) => {
        picture_list.push(item.src)
    })
    // 创建预览层
    var preview_html = "<div class='preview' style='display: none; transform: translate3d(0px, 0px, 0px)'>";
    var cur_index = 1;
    picture_list.forEach(item => {
        /*
        */
        preview_html += 
        `
            <div class='perview_item'>
                <div class='perview_item_title_box'>
                    <div class='perview_item_title'>${cur_index} / ${picture_list.length}</div>
                </div>
                <div class="perview_item_img">
                    <img src='${item}' />
                </div>
            </div>
        `
        cur_index += 1;
    })

    preview_html += "</div>"
    
    // 创建预览层
    $("body").append(preview_html)
    var eleW = $(".perview_item").width();
    $(".perview_item_img img").attr('perview_top_px', 0)
    // 滑动基数
    var perview_left_px = 0;
    var perview_top_px = 0;

    // 添加点击事件
    $(".picture_item").on("click", (e) => {
        let index = picture_list.indexOf(e.target.src);
        perview_left_px = eleW * (-1) * index;
        $(".preview").css("transform", `translate3d(${perview_left_px}px, 0px, 0px)`);
        $(".preview").css("display", "flex");
    })


    // 滑动事件
    function touchFunc() {
        var startX, startY;
        var moveX, moveY;
        var endX, endY;
        var touchDirectionValue;
        var startT, endT;
        // 超时时间 单位ms
        var setTime = 200;
        $(".perview_item").on("click", (e) => {
            e.preventDefault();
            $(".preview").css("display", "none");
        })
        $(".perview_item").on("touchstart", (e) => {
            e.preventDefault();
            startX = (e.changedTouches || e.originalEvent.changedTouches)[0].pageX;
            startY = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
            isTouch = true;
            startT = new Date();
        })


        $(".perview_item").on("touchmove", (e) => {
            e.preventDefault();
            moveX = (e.changedTouches || e.originalEvent.changedTouches).pageX;
            moveY = (e.changedTouches || e.originalEvent.changedTouches).pageY;
            touchDirectionValue = touchDirection(startX, startY, moveX, moveY);
            let picture_index = showPictureIndex();
            let picture_X_local = perview_left_px;
            let picture_Y_local = perview_top_px;
            // 滑动手势的方向
            switch (touchDirectionValue) {
                case 1: 
                    if (e.target.nodeName === "DIV" || (e.target.height || e.target.clientHeight) < win_preview_height) return;
                    picture_Y_local = picture_Y_local + ((moveY - startY) / 5);
                    if (tuochHeight(Math.abs(picture_Y_local), e.target.height)) picture_Y_local = (e.target.height - win_preview_height) * (-1);
                    break;
                case 2:
                    if (e.target.nodeName === "DIV" || (e.target.height || e.target.clientHeight)  < win_preview_height) return;
                    picture_Y_local = picture_Y_local + ((moveY - startY) / 5);
                    if (picture_Y_local > 0) picture_Y_local = 0;
                    break;
                case 3: // 左
                    perview_top_px = 0;
                    if (picture_index === 1) picture_X_local = perview_left_px;
                    else picture_X_local = perview_left_px + moveX - startX;
                    break;
                case 4: // 右
                    perview_top_px = 0;
                    if (picture_index === -1) picture_X_local = perview_left_px;
                    else picture_X_local = perview_left_px + moveX - startX;
                    break;
            }
            perview_top_px = picture_Y_local;
            $(".preview").css("transform", `translate3d(${picture_X_local}px, ${picture_Y_local}px, 0px)`);
        })

        $(".perview_item").on("touchend", (e) => {
            e.preventDefault();
            endX = (e.changedTouches || e.originalEvent.changedTouches).pageX;
            endY = (e.changedTouches || e.originalEvent.changedTouches).pageY;
            endT = new Date();
            // 模拟点击事件
            if (Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5) {
                $(".preview").css("display", "none");
                isMoved = false;
            }
            touchDirectionValue = touchDirection(startX, startY, moveX, moveY);
            let picture_index = showPictureIndex();
            let touchTime = timeOut(startT, endT);
            let touchWidth = Math.abs(endX - startX);
            switch (touchDirectionValue) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    if (picture_index !== 1 && ((!touchTime && Math.abs(endX - startX) > 10) || touchWidth >= (eleW * 0.3))) {perview_left_px -= eleW; perview_top_px = 0;}
                    else perview_left_px += 0;
                    break;
                case 4:
                    if (picture_index !== -1 && ((!touchTime && Math.abs(endX - startX) > 10) || touchWidth >= (eleW * 0.3))) {perview_left_px += eleW; perview_top_px = 0;}
                    else perview_left_px -= 0;
                    break;
            }
            $(".preview").css("transform", `translate3d(${perview_left_px}px, ${perview_top_px}px, 0px)`);
        })

        // 判断滑动方向
        function touchDirection(startx, starty, endx, endy) {
            var angx = endx - startx;
            var angy = endy - starty;
            var result = 0;

            //如果滑动距离太短
            if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
                return result;
            }
            
            var angle = getAngle(angx, angy);
            if (angle >= -135 && angle <= -45) {
                result = 1; // 向上
            } else if (angle > 45 && angle < 135) {
                result = 2; // 向下
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3; // 向左
            } else if (angle >= -45 && angle <= 45) {
                result = 4; // 向右
            }
            return result;
        }

        // 判断角度
        function getAngle(angx, angy) {
            return Math.atan2(angy, angx) * 180 / Math.PI;
        };

        // 超时时间
        function timeOut(startT, endT) {
            return endT - startT > setTime;
        }

        // 判断当前显示图片的下标 -1 第一张 0 中间 1 最后一张
        function showPictureIndex() {
            if (perview_left_px === 0) return -1;
            if (perview_left_px === eleW * (picture_list.length - 1) * (-1)) return 1;
            else return 0;
        }

        // 判断图片上下滑的位置是否超过了图片本身的高度
        function tuochHeight(movex, pictureHeight) {
            // 超过了高度
            if (movex + win_preview_height >= pictureHeight) {
                return true;
            } else {
                return false;
            }
        }        
    }
    function getClientHeight() {
        var clientHeight = 0;
        if(document.body.clientHeight && document.documentElement.clientHeight) {
            var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? 
                document.body.clientHeight:document.documentElement.clientHeight;
        }
        else {
            var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight) ? 
                document.body.clientHeight:document.documentElement.clientHeight;
        }
        return clientHeight;
    }
    touchFunc();
}