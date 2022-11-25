## 数据结构格式
``` js
{
	"canvas_0": {
		"fields": [
			{
				"name": "AnsoDataformSelect_1665540951078",
				"key": "AnsoDataformSelect_1665540951078",
				"compTag": "AnsoDataformSelect",
				"label": "自定义字段",
				"tag": "select",
				"options": [
					{
						"label": "选项1",
						"value": 1
					},
					{
						"label": "选项2",
						"value": 2
					}
				],
				"clearable": true,
				"filterable": true,
				"defaultValue": {
					"customFunc": "(data, fields, field) => {\n return data[field.name]}",
					"valueType": "isPreset"
				},
				"placeholder": "请选择",
				"labelPosition": "right",
				"readOnly": false,
				"optionType": "optionsAsyncFunc",
				"rules": {
					"isRequired": {
						"required": true,
						"message": "必填"
					},
					"isRegexp": null,
					"isValidator": null
				},
				// TODO 只存储"__isChange"的配置
				"optionsAsyncFunc": {
					"method": "GET",
					"url": "/api/wateruserCode",
					"header": null,
					"body": [
						{
							"key": "code",
							"value": "12",
							"varType": "const",
							"__key": 1665541989121
						}
					],
					"dataHandle": [
						"beforeRequired"
					],
					"beforeRequired": {
						"name": "beforeRequired",
						"title": "请求发送前",
						"params": {
							"params": "表单数据，即提交的数据"
						},
						"placeholder": "params.name ='vs'\n return params",
						"funcDefault": "(params) => { return params }",
						"funcInput": "(params) => { params.name ='vs'\n return params }",
						"__isChange": true
					},
					"afterRequired": {
						"name": "afterRequired",
						"title": "请求返回响应数据时",
						"params": {
							"res": "响应参数，允许写Promise函数，触发error的catch"
						},
						"placeholder": "\n return res.data",
						"funcDefault": "(res) => { return res.data }",
						"funcInput": ""
					},
					"error": {
						"name": "error",
						"title": "异常数据处理",
						"params": {
							"err": "异常数据"
						},
						"placeholder": "\n return err",
						"funcDefault": "(err) => { return err }",
						"funcInput": ""
					},
					"name": ""
				},
				"filterAbleAsyncFunc": {
					"name": "/api/getUser_GET",
					"method": "GET",
					"url": "/api/getUser",
					"demo": "示例: 获取用水户信息",
					"body": [
						{
							"key": "waterUserCode",
							"value": "123",
							"varType": "const",
							"__key": 1111
						}
					],
					"__index": 0
				},
				"filterAbleType": "filterAbleAsyncFunc"
			}
		],
		"form": {
      "name": '', // TODO
      "label": '', // TODO
			"attrs": {
				"layout": "default",
				"labelWidth": 100,
				"labelPosition": "right",
				"readOnly": false,
				"keepAliveData": true, // TODO 暂无实现方式
        "preSlot": "", // TODO new 前置插槽 - <String> / <Component>
        "suffixSlot": "" // TODO new  后置插槽 - <String> / <Component>
        // TODO 通过组合/解体的方式形成组合型的表单布局
				// 2. 增加表单内字段分组的概念 ---- 分组名称、分组排序
				// 3. 增加表单按钮配置属性 --- 按钮数量、单按钮属性、位置
				// 4. 增加表单底部自定义、顶部自定义，选中则在左边高亮显示区域？
			},
			"actions": {
				"immediateRemoteRequire": {},
				"getResourceImmediate": false,
				"getRelationImmediate": true
			}
		},
		groups: [],
		template: 'form'
	}
}
```