window.onload=function(){
    alert("~~~��ӭ����DJ���в������~~~");
}
//btn0
var arr = new Array();  //���岢��ֵ
arr.push("ǣ������֣�����ӵ�о��㹻��");
arr.push("��ʶ���㣬�ҵ�������������ʼ");
arr.push("�غ������ǵ�ר��С����");
arr.push("�һ��ǵõ�һ�ο�����ĳ�������ʱ���Ҳ�û�뵽�������������ô��Ҫ��");
arr.push("ֻҪ���Ҹ������ֶ�����˵����һ���Ҹ�");
arr.push("��һ���ˣ����ĺܺã�����Ҫ��˭ʩ��������");
arr.push("���һ����ֻ��һ�̣���һ�̱�������");
arr.push("����ʮ������������㣻������������������");
arr.push("����������������˽�Ļ����ǣ�������һ���˵�");
arr.push("ǣ�����һ���������ҵ�����Զ������");
arr.push("��Щ·��Զ������ȥ����ۡ����ǣ����ߣ�����");

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