var emailInput = document.getElementById('email-input');
var emailSugWrapper = document.getElementById('email-sug-wrapper');
//邮箱后缀List
var postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
//增加一个变量，用于储存当前选中的提示Li的序号
var nowSelectTipIndex = 0;
emailInput.addEventListener('input', function (e) {
    if (!(e.keyCode == 40 || e.keyCode == 38 || e.keyCode ==13)) {
        nowSelectTipIndex = 0;
    }
    //控制email-sug-wrapper的显示/隐藏状态
    judgeNull();
    //获取用户输入，生成提示框中的提示内容，将提示内容添加到email-sug-wrapper中
    addLi();
})
//鼠标点击某个提示，此提示内容进入输入框，同时进行解码和提示框消失
emailSugWrapper.addEventListener("click", function (e) {
    //采用事件代理，监听父级点击事件，通过target获取当前li
    var e = e || window.event;
    var target = e.target || e.srcElement;
    //判断被点击的是否为提示框中的li节点
    if (target.nodeName.toLowerCase() == "li") {
        //提示框消失
        hide();
        emailInput.focus();//写在return之前，否则无效
        //将内容放到输入框中
        emailInput.value = htmlDecode(target.innerHTML);//解码
    }
})

//键盘事件
document.addEventListener('keydown', function (e) {
    //采用事件代理，监听父级点击事件
    var e = e || window.event;
    var key = e.which || e.keyCode;
    var lis = document.getElementsByTagName('li');
    //当有输入框的时候，按上键，可以向上移动选择状态
    if (key == 38) {
        for (var i = 0; i < lis.length; i++) {
            lis[i].setAttribute("class", "");
        }
        nowSelectTipIndex--;
        //按键之前的被选择提示是第一个，则被选择状态移到最后一个
        if (nowSelectTipIndex < 0) {
            nowSelectTipIndex = lis.length - 1;
        }
        lis[nowSelectTipIndex].setAttribute("class", "active");
    }
    //当有输入框的时候，按下键，可以向下移动选择状态
    if (key == 40) {
        for (var i = 0; i < lis.length; i++) {
            lis[i].setAttribute("class", "");
        }
        nowSelectTipIndex++;
        //按键之前的被选择提示是最后一个，则被选择状态移到第一个
        if (nowSelectTipIndex + 1 > lis.length) {
            nowSelectTipIndex = 0;
        }
        lis[nowSelectTipIndex].setAttribute("class", "active");
    }
    //当有输入框的时候，按回车键，将当前被选中状态的提示内容放入输入框中，并隐藏提示框
    if (key == 13) {
        //将当前被选中状态的提示内容放入输入框中
        emailInput.value = htmlDecode(lis[nowSelectTipIndex].innerHTML);
        //隐藏提示框
        hide();
    }
    //用户按ESC键的时候，对用户输入进行全选
    if (key == 27) {
        //全选输入框内容
        emailInput.setSelectionRange(0, -1);
        //隐藏提示框
        hide();
    }
})

//控制email-sug-wrapper的显示/隐藏状态
function judgeNull() {
    //当用户输入字符后显示提示框
    block();
    //判断输入框中的内容是否为空，即当用户没有任何输入时，提示框消失
    if (getText() == '') {
        hide();
    }
}
//隐藏提示框
function hide() {
    emailSugWrapper.style.display = 'none';
}
//显示提示框
function block() {
    emailSugWrapper.style.display = 'block';
}
//获取用户输入，拿到input输入框的输入内容trim后返回（去除首尾空格）
function getText() {
    return emailInput.value.trim();
}

//判断是否生成新的数组
function postlist() {
    //获取用户输入
    var userinput = getText();
    var newpostlist = new Array();
    //用户输入含有@
    if (userinput.indexOf('@') != 0){
        //获取@在所输入字符串的位置
        var len = userinput.indexOf('@');
        //用来拼接的用户输入内容 = 只使用@之后的字符串
        var x = userinput.substring(len + 1, userinput.length);//取@之后的部分
        //遍历postfixList
        for (var i = 0; i < postfixList.length; i++){
            //用来
            if (postfixList[i].indexOf(x) == 0) {
                //将此字符串加入新的数组中
                newpostlist.push(postfixList[i]);
            }
        }
        //若@后没有字符或者新数组newpostlist为空，就返回原来的postfixList
        if (x === '' || newpostlist == '') {
            //返回生成的提示内容
            return postfixList;
        }
        //返回生成的提示内容
        return newpostlist;
    } else {
        //返回生成的提示内容
        return postfixList;
    }
}
//根据输入内容和匹配来生成提示数组
function promptContent() {
    //获取用户输入，生成提示内容，对特殊字符进行转义编码
    var x = htmlEncode(getText());
    var tips = new Array();
    // 用户输入含有@
    // 此处indexOf和search都可用使用，indexOf()是比search()更底层的方法，一般情况下使用indexOf()，查找效率高些，search()用于参数为正则表达式
    if (x.indexOf("@") != -1) {
        //用来拼接的用户输入内容 = @之前的字符串
        var p = x.slice(0, x.indexOf("@"));
        //把用来拼接的用户输入内容和这个字符串进行结合成为一个Li
        for (i = 0; i < postlist().length; i++) {
            tips[i] = p + "@" + postlist()[i];
        }
    } else {
        //用户输入不含@，遍历postfixList，并和用户输入的内容结合成为一个Li
        for (i = 0; i < postfixList.length; i++) {
            tips[i] = x + "@" + postfixList[i];
        }
    }
    //返回生成的提示内容
    return tips;
}
//邮箱提示函数
function addLi() {
    var tips = promptContent();
    while (emailSugWrapper.hasChildNodes()) {
        emailSugWrapper.removeChild(emailSugWrapper.firstChild);
    }
    //将之前的列表清除掉，然后重新生成新的列表
    for (i = 0; i < tips.length; i++) {
        var tip_li = document.createElement("li");
        tip_li.innerHTML = tips[i];
        emailSugWrapper.appendChild(tip_li);
    }
    //默认第一个提示为被选中状态，加类名且背景颜色为粉色（需要生成li之后再调用）
    var lis = document.getElementsByTagName("li");
    lis[0].setAttribute("class", "active");
}
// 对于特殊字符进行转义编码，比如使<b>经过转码编码后可以正常使用
// 用浏览器内部转换器实现html转码
function htmlEncode(html) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
    (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
    //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
    var output = temp.innerHTML;
    temp = null;
    return output;
}

//用浏览器内部转换器实现html解码
function htmlDecode(text) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = text;
    //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}