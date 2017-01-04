// 供货信息>基础信息 修改密码弹窗
window.onload=function(){
	var $rebtn=document.getElementById('rebtn');
	var $mymark=document.getElementById('mymark');
	var $mypop01=document.getElementById('pop01');
	var $myoff=document.getElementById('off01');
	var $newpass=document.getElementById('newpass');
	var $repass=document.getElementById('repass');
	var $cancel=document.getElementById('cancel');
	$rebtn.onclick=function(){
		$newpass.value="";
		$repass.value="";
		$mymark.style.display="block";
		$mypop01.style.display="block";
		$mymark.style.height=document.body.scrollHeight+"px";
	}
	$myoff.onclick=function(){
		$mymark.style.display="none";
		$mypop01.style.display="none";
	}
	$cancel.onclick=function(){
		$mymark.style.display="none";
		$mypop01.style.display="none";
	}
}	