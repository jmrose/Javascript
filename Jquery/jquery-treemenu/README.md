# jquery-treemenu

Jquery Plugin - treemenu



````html


**** 사용법 *****

 options
    header : boolean ( true, false : 상단에 내용 추가 여부 )
    header_content : string (내용)
    header_open : string (펼치기)
    header_close : string (닫기)

<head>
   <link href="/css/jquery.treemenu.css" rel="stylesheet">
   <link href="/css/font-awesome.min.css" rel="stylesheet">   
   <script src="/js/jquery.min.js"></script>
   <script src="/js/jquery.treemenu.js"></script>
</head>

<script>
  $("#treemenus").treemenu({
    header:true,
    header_content:'검색어 : <input type="text" id="tree-word" />',
    header_close:'닫기',
    header_open:'펼치기'
  });
</script>

<body>
<div id="treemenus">
   <ul>
      <li>
	         <label>남성</label>
	         <ul>
		           <li> <input type="checkbox" /> 상의</li>
		           <li> <input type="checkbox" /> 하의</li>
		           <li> <input type="checkbox" /> 악세사리</li>
	         </ul>
      </li>
   </ul>
   <ul>
      <li>
	        <label>여성</label>
	        <ul>
		           <li> <input type="checkbox" /> 상의</li>
		           <li> <input type="checkbox" /> 하의</li>
		           <li> <input type="checkbox" /> 신발</li>
		           <li> <input type="checkbox" /> 가방</li>
		           <li> <input type="checkbox" /> 악세사리</li>
	        </ul> 
      </li>
   </ul>
   <ul>
      <li>
	        <label>아동</label>
	        <ul>
		          <li> <input type="checkbox" /> 상의</li>
		          <li> <input type="checkbox" /> 하의</li>
	        </ul>
      </li>
   </ul>
 </div>
</body>
