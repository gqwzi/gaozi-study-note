window.onload=function(){
    alert("~~~欢迎来到DJ高仔插件中心~~~");
}
//btn0
var arr = new Array();  //定义并赋值
arr.push("牵着你的手，今生拥有就足够了");
arr.push("认识了你，我的人生才真正开始");
arr.push("守候着我们的专属小甜蜜");
arr.push("我还记得第一次看到你的场景，那时的我并没想到现在你对我是那么重要。");
arr.push("只要你幸福，放手对我来说是另一种幸福");
arr.push("我一个人，过的很好，不需要有谁施舍我温柔");
arr.push("你的一生我只借一程，这一程便是余生");
arr.push("春风十里，不及相遇有你；晴空万里，不及心中有你");
arr.push("世上最浪漫和最自私的话就是：你是我一个人的");
arr.push("牵你就像一碗汤，让我的心永远不会凉");
arr.push("有些路很远，走下去会很累。可是，不走，会后悔");

var button0 = document.getElementById("btn0")
button0.onclick = function() {
    var index = Math.floor(Math.random()*11);
    alert(arr[index]);
}

//btn1
var button1 = document.getElementById("btn1")
button1.onclick = function() {
    password();
}

function password() {
    var m="",i=16;
    for(;i>=0;i--){
        m+=String.fromCharCode(Math.floor(Math.random()*94+33));
    }
    var divEle = document.getElementById("divId");
    divEle.innerHTML = divEle.innerHTML + "</br>" + "---" + m  + "---" ;
}