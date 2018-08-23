var trans
var origin
$ui.render({
    props: {
        title: ""
    },
    views: [{
        type: "input",
        props: {
            id: "search_input",
            type: $kbType.search,
            darkKeyboard: true,
        },
        layout: function (make, view) {
            make.height.equalTo(50)
            make.left.top.right.inset(10)
        },
        events: {
            
        }
    },
    {
        type: "button",
        props: {
            title: "查询",
            id: "search_button",
            layout: $layout.fill,
        },
        layout: function (make, view) {
            make.height.equalTo(50)
            make.top.inset(70)
            make.left.right.inset(10)
        },
        events: {
            tapped: function (sender) {
                var i = $("search_input")
                translate(i.text)
                console.log($app.env)
                $("search_input").blur()
            }
        }
    },
    {
        type: "text",
        props: {
            id: "result",
            // bgcolor: $color("#4484f4"),
            textColor: $color("black"),
            editable: false,
            selectable: true
        },
        layout: function (make, views) {
            make.edges.insets($insets(130, 10, 40, 10)) //上、左、下、右
        },
        events: {

        }
    }
    ]
});


/**
 * 控制是否获取剪贴板的内容
 */
function get_clipboard_text(){
    var clipboarg_text = $clipboard.text
    if (clipboarg_text){
        $ui.alert({
            title: "小声哔哔=.=",
            message: "是否复制剪贴板内容",
            actions:[
                {
                    title: "OK",
                    handler: function(){
                        $("search_input").text = clipboarg_text
                    }
                },
                {
                    title: "Cancel",
                    handler: function(){

                    }
                }
            ]
        });
    }
}

/**
 * 更改翻译类型
 * 默认：英文->中文
 */
function change_translate_type(){
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    trans = "zh-CN"
    origin = "en-US"
    if(reg.test($("search_input").text)){   //判断是否是中文
        trans = "en-US"
        origin = "zh-CN"
    // return trans, origin
    }
}

/**
 * 翻译
 * @param {string} search_text 
 */
function translate(search_text) {
    change_translate_type();
    $http.post({
        url: "https://translate.google.cn/translate_a/single",
        header: {
            "User-Agent": "iOSTranslate",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            "dt": "t",
            "q": search_text,
            "tl": trans, //翻译成
            "ie": "UTF-8",
            "sl": origin, //原始的
            "client": "ia",
            "dj": "1"
        },
        handler: function (resp) {
            var data = resp.data;
            var sentences = data['sentences']
            var result = sentences[0]['trans']
            $("result").text = result
        }
    });
}


get_clipboard_text()