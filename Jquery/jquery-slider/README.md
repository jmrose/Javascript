## Jquery Slider Example

>Explorer 8/9 지원.  
여러개의 slider 지원. ( className : content1 > content2 로 변경사용)  
slider.css or slider2.css  다양한 UI에 활용가능.

<br />
  
* 상위 레이아웃에 className(slider, content1)을 지정한다  class="slider content1"
* slider 버튼에 상위에서 지정한 className과 방향(direction)을 넣어준다   onclick="onSlide('.content1', 'right')"  


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
