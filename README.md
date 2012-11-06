jqeury.editable.js
==================

## 作用

jqeury.editable.js用于行内编辑单元格数据，即双击后将表格单元格转为输入元素（input或select），输入完成后使用ajax提交数据，完成修改功能。

## 用法

    $("#tableid").ediTable({submit:"url.html"});

**注意**：需要编辑的td单元格，必须有name属性，如name="num"

**数据发送**：默认使用input输入框，编辑之后（值有变化），将发送ajax请求，请求格式是： submit地址?name=name值&value=用户输入值

## 使用select

如需使用select下拉菜单，有两种方式，一种是静态数据，给td添加options属性，参考格式如下：

    <td name="num" options="[{value:'10',text:'10'},{value:'30',text:'30'},{value:'50',text:'50'}]">100</td>

数据请遵循该格式，插件会自动生成select。

第二种方式是动态数据，通过ajax请求,需要给td添加dataURL属性，参考格式如下：

    <td name="sale" dataURL="xxx.html">20</td>

按照上面的格式，插件会自动发送ajax请求获取select数据，ajax请求格式为：dataURL地址?name=name值，数据获取成功后，会自动插入select。

## option

    submit：数据提交地址，必须
    event：交互事件，默认为dblclick
    editSelector：用于配置表格中可编辑的子元素，默认为td（所有单元格），也可使用如td.edit(只有class="edit"的td才会编辑)
    success：修改成功之后的回调函数。默认为null。可用于修改之后的提示或其他关联操作，默认附带一个参数result（ajax请求成功之后的返回数据）
    preData：预处理数据方法，用于组织其他自定义附加数据。该方法默认附带一个参数td，指代当前编辑的单元格，可根据实际需要以该td为基点组织数据。示例如下：
        preData:function(td){
           //td为当前被编辑的单元格，可根据该td获取其他元素，如其父元素tr或其他兄弟节点
           var tr = td.parent();//此处示例获取tr
           var id = tr.attr("id");//此处示例获取tr的id属性值，可根据需要自己编写代码
           return {idx:id}; //最后必须返回一组数据,数据个数自定义（必须使用json格式{key:value,key:value}）
           //返回的数据会被自动追加到ajax请求的后面，拼成的格式为：submit地址?name=name值&value=用户输入值&idx=tr的id值
        }

 配置项的使用方法

    $("#tableid").ediTable({
        submit:"url.html",
        editSelector:"td.edit",
        success:function(){alert("修改成功");}
    });

## 欢迎使用

欢迎使用，如有意见或建议，可发送邮件至wyqbailey@gmail.com，或直接在github上反馈。

