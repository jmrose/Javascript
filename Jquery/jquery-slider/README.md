## Jquery && Explorer 8 용 Slider Sample

* 상위 레이아웃에 className(slider, content1)을 지정한다  class="slider content1"
* slider 버튼에 상위에서 지정한 className과 방향(direction)을 넣어준다   onclick="onSlide('.content1', 'right')"  

<br />
<br />

>페이지 내에 여러개의 Slider 사용이 가능하도록 onSlide() 함수로 처리하였으니,  
상위 className > content1 명을 변경하여 여러개의 slider를 추가사용하십시오.  
Css은 slider.css or slider2.css 와 같이 수정하여 다양한 UI에 활용가능합니다.

<br />

```
<div class="slider content1">
    <span class="next"><a href="javascript://" onclick="onSlide('.content1', 'right')"><i
            class="fa fa-angle-double-left fa-3x fa-square"></i></a></span>
    <ul>
      <li><li>
    </ul>
    <span class="prev"><a href="javascript://" onclick="onSlide('.content1', 'left')"><i
            class="fa fa-angle-double-right fa-3x"></i></a></span>
</div>            

<div class="slider content2">
    <span class="next"><a href="javascript://" onclick="onSlide('.content2', 'right')"><i
            class="fa fa-angle-double-left fa-3x fa-square"></i></a></span>
    <ul>
      <li><li>
    </ul>
    <span class="prev"><a href="javascript://" onclick="onSlide('.content2', 'left')"><i
            class="fa fa-angle-double-right fa-3x"></i></a></span>
</div> 
```


![image](https://user-images.githubusercontent.com/10750383/47081189-e5cfa580-d244-11e8-9b18-f0c0299f25eb.jpg)

![image2](https://user-images.githubusercontent.com/10750383/47081965-23353280-d247-11e8-8edd-3bcd85698165.jpg)
