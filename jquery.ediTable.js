/**
 * Created with JetBrains WebStorm.
 * author: wyqbailey
 * version: 0.1
 * Date: 12-9-6
 * Time: 下午10:08
 * To change this template use File | Settings | File Templates.

//行内编辑表格
 调用方法：$("#tableid").ediTable({submit:"url.html"});
 使用注意：需要编辑的td单元格，必须有name属性，如name="num"
 默认使用input输入框，编辑之后（值有变化），将发送ajax请求，请求格式是： submit地址?name=name值&value=用户输入值

 如需使用select下拉菜单，有两种方式，一种是静态数据，给td添加options属性，参考格式如下
    <td name="num" options="[{value:'10',text:'10'},{value:'30',text:'30'},{value:'50',text:'50'}]">100</td>
 数据请遵循该格式，插件会自动生成select
 第二种方式是动态数据，通过ajax请求,需要给td添加dataURL属性，参考格式如下：
    <td name="sale" dataURL="xxx.html">20</td>
 按照上面的格式，插件会自动发送ajax请求获取select数据，ajax请求格式为：dataURL地址?name=name值，数据获取成功后，会自动插入select

 用户在select中重新选择后，将发送ajax请求，请求格式是： submit地址?name=name值&value=用户输入值

 其他配置项：
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
    $("#tableid").ediTable({submit:"url.html",editSelector:"td.edit",success:function(){alert("修改成功");}});
 */
jQuery.fn.extend({
    ediTable: function(options) {
        var defaults = {event:"dblclick",submit:"",editSelector:"td",success:null,preData:null};
        var opts = $.extend(defaults,options);
        if(opts.submit=="") return;
        this.each(function(){
            var $this = $(this);
            $this.find(opts.editSelector).each(function(){
                var td = $(this);
                if(td.children().length>1||!td.attr("name")) return true;
                var name = td.attr("name");
                td.attr("original",td.text());
                td.bind(opts.event,function(){
                    var input,width=parseInt(td.width());
                    if(td.attr("options")){
                        var options = eval("("+td.attr("options")+")");
                        input = $("<select name='"+name+"' value='"+options[0].value+"'></select>");
                        for (var i in options){
                            input.append("<option value='"+options[i].value+"'>"+options[i].text+"</option>");
                        }
                    }else if(td.attr("dataURL")){
                        var options;
                        input = $("<select name='"+name+"'></select>");
                        $.post(td.attr("dataURL"),{name:name},function(r){
                            options = eval("("+r+")");
                            for (var i in options){
                                input.append("<option value='"+options[i].value+"'>"+options[i].text+"</option>");
                            }
                            input.val(options[0].value);
                        },"text");
                    }else{
                        input = $("<input type='text' name='"+name+"' value='"+td.text()+"' />");
                    }
                    if(!input) return;
                    input.css("width",width-6+"px").bind("blur",function(){
                        var $input = $(this);
                        if($input.val()&&$input.val()!=td.attr("original")){
                            var data = {name:name,value:$input.val()};
                            var preData = (opts.preData && opts.preData(td)) || {};
                            data = $.extend(data, preData);
                            $.ajax({
                                url:opts.submit,
                                data:data,
                                success:function(r){
                                    if(r=="false"){
                                        td.html(td.attr("original"));
                                    } else{
                                        td.html($input.val());
                                        td.attr("original",$input.val());
                                        opts.success && opts.success(r);
                                    }
                                },
                                error:function(){
                                    td.html(td.attr("original"));
                                },
                                dataType:"text"
                            });
                        }else{
                            td.html(td.attr("original"));
                        }
                    }).bind("click",function(e){
                            e.stopPropagation();
                        });
                    td.bind("click",function(){
                        input.trigger("blur");
                    });
                    td.html(input);
                    input.focus();
                });
            });
        });
    }
});
