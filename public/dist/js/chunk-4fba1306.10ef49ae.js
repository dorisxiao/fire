(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4fba1306"],{"22d1":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"fillcontain"},[a("h3",[t._v("违规数据录入")]),a("div",{staticClass:"contain"},[a("div",{staticClass:"table_container"},[a("el-row",{staticClass:"readWrapper"}),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,border:"",stripe:"","highlight-current-row":"","header-cell-class-name":"table-header-class"}},[a("el-table-column",{attrs:{label:"序号",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.$index+(t.paginations.pageIndex-1)*t.paginations.pageSize+1))])]}}])}),a("el-table-column",{attrs:{property:"batch_name",label:"批次",align:"center"}}),a("el-table-column",{attrs:{property:"updateTime",label:"时间段",formatter:t.formatTime,align:"center"}}),a("el-table-column",{attrs:{fixed:"right",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(a){return t.editClick(e.row)}}},[t._v("编辑")])]}}])})],1),a("el-row",[a("el-col",{attrs:{span:24}},[a("div",{staticClass:"pagination"},[t.paginations.total>0?a("el-pagination",{attrs:{"page-sizes":t.paginations.pageSizes,"page-size":t.paginations.pageSize,layout:t.paginations.layout,total:t.paginations.total,"current-page":t.paginations.pageIndex},on:{"current-change":t.handleCurrentChange,"size-change":t.handleSizeChange}}):t._e()],1)])],1)],1)]),a("el-dialog",{staticClass:"customWidth",attrs:{title:"成绩录入",visible:t.dialogFormVisible2},on:{"update:visible":function(e){t.dialogFormVisible2=e}}},[a("el-form",{attrs:{model:t.form}},[a("el-form-item",{staticClass:"formLabelWidth2",attrs:{label:"选择批次：","label-width":t.formLabelWidth}},[a("el-input",{attrs:{disabled:!0,autocomplete:"off"},model:{value:t.form.batch_name,callback:function(e){t.$set(t.form,"batch_name",e)},expression:"form.batch_name"}})],1),a("el-form-item",{staticClass:"formLabelWidth2",attrs:{label:"对阵双方：","label-width":t.formLabelWidth}},[a("el-input",{attrs:{disabled:!0,autocomplete:"off"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),a("el-form-item",{staticClass:"formLabelWidth2",attrs:{label:"对阵时间：","label-width":t.formLabelWidth}},[a("el-input",{attrs:{disabled:!0,autocomplete:"off"},model:{value:t.form.timeD,callback:function(e){t.$set(t.form,"timeD",e)},expression:"form.timeD"}})],1),a("el-form-item",{staticClass:"inputNum",attrs:{label:"武器数量：","label-width":t.formLabelWidth}},[a("li",[a("span",{staticClass:"hpTitle"},[t._v("P-10:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.weapon[10],callback:function(e){t.$set(t.weapon,10,e)},expression:"weapon[10]"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("P-12:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.weapon[12],callback:function(e){t.$set(t.weapon,12,e)},expression:"weapon[12]"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("P-15:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.weapon[15],callback:function(e){t.$set(t.weapon,15,e)},expression:"weapon[15]"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("航炮:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.weapon[255],callback:function(e){t.$set(t.weapon,255,e)},expression:"weapon[255]"}})],1)]),a("p",{staticClass:"wgTitle"},[t._v("违规情况:")]),a("div",{staticClass:"wgButtom"},[a("el-form-item",{attrs:{label:"违规发射：","label-width":t.formLabelWidth}},[a("div",{staticClass:"block"},[a("el-cascader",{attrs:{options:t.optionsFS,props:{multiple:!0,checkStrictly:!0,value:"id",label:"info"},clearable:""},on:{change:t.handleAreaChange}})],1)]),a("div",{staticClass:"inputNum2"},[a("li",[a("span",{staticClass:"hpTitle"},[t._v("高度违规:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.form.height,callback:function(e){t.$set(t.form,"height",e)},expression:"form.height"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("突破安全球:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.form.ball,callback:function(e){t.$set(t.form,"ball",e)},expression:"form.ball"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("报告词违规:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.form.report,callback:function(e){t.$set(t.form,"report",e)},expression:"form.report"}})],1),a("li",[a("span",{staticClass:"hpTitle"},[t._v("其他违规:")]),a("el-input-number",{attrs:{size:"mini",min:0,max:10},model:{value:t.form.other,callback:function(e){t.$set(t.form,"other",e)},expression:"form.other"}})],1)]),a("el-form-item",{attrs:{label:"补充说明：","label-width":t.formLabelWidth}},[a("el-input",{attrs:{type:"textarea",autocomplete:"off"},model:{value:t.about,callback:function(e){t.about=e},expression:"about"}})],1)],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"userButModle",on:{click:function(e){t.dialogFormVisible2=!1}}},[t._v("取 消")]),a("el-button",{staticClass:"userButModle",attrs:{type:"primary"},on:{click:t.add}},[t._v("确定")])],1)],1)],1)},n=[],o=(a("6d57"),a("ff21"),a("163d"),a("5ee1")),s={data:function(){return{valueDate:"",nameSearch:"",value:"",form:{ball:0,height:0},weapon:{10:0,12:0,15:0,255:0},user:this.sessionData("get","user"),dialogFormVisible2:!1,formLabelWidth:"120px",tableData:[],optionsFS:[],about:"",loading:!1,paginations:{total:0,pageIndex:1,pageSize:10,pageSizes:[5,10,15,20],layout:"total, sizes, prev, pager, next, jumper"},selectId:""}},mounted:function(){this.ccList({count:this.paginations.pageSize,index:this.paginations.pageIndex,uid:this.user._id,search:{state:1}})},methods:{handleClick:function(t){},handleAreaChange:function(t){this.form.fire=t},add:function(){var t=this,e={_id:this.selectId,uid:this.user._id,weapon:this.weapon,foul:{height:this.form.height,ball:this.form.ball,report:this.form.report,fire:this.form.fire||[],other:Number(this.form.other||0)},about:this.about};Object(o["c"])(e).then((function(e){0==e.code&&(t.$message({message:"违规数据录入成功！",type:"success"}),t.ccList({count:t.paginations.pageSize,index:t.paginations.pageIndex,uid:t.user._id,search:{state:1}}),t.dialogFormVisible2=!1)}))},setfire:function(t){var e=this;this.selectId=t,Object(o["f"])({_id:t,uid:this.user._id}).then((function(t){if(0==t.code){var a=e.$unfly(t.data);console.log("违规发射",a),a.forEach((function(t){t.info=t.miss+"--"+e.$tool.formatDate(new Date(t.time))})),e.dialogFormVisible2=!0,e.optionsFS=a}}))},formatTime:function(t){return t.timeD=this.$tool.formatDate(new Date(t.start))+"--"+this.$tool.formatDate(new Date(t.end)),t.timeD},editClick:function(t){this.setfire(t._id),this.form=t},ccList:function(t){var e=this,a=this.$tool.deep(t);a.index-=1,Object(o["b"])(a).then((function(t){if(0==t.code){var a=e.$unfly(t.data);e.loading=!1,e.paginations.total=a.total;var i=a.users;a.array.forEach((function(t){t.name="",t.loser.forEach((function(e){t.name+=i[e],t.name+=" "})),t.name+="VS ",t.winner.forEach((function(e){t.name+=i[e],t.name+=" "}))})),console.log("88888888888888",a),e.tableData=a.array,e.paginations.total=a.total}}))},handleSizeChange:function(t){this.paginations.pageSize=t,this.ccList({count:this.paginations.pageSize,index:this.paginations.pageIndex,search:{state:1}})},handleCurrentChange:function(t){this.paginations.pageIndex=t,this.ccList({count:this.paginations.pageSize,index:this.paginations.pageIndex,search:{state:1}})}}},l=s,r=(a("ad99"),a("4023")),c=Object(r["a"])(l,i,n,!1,null,"4a720555",null);e["default"]=c.exports},"5ee1":function(t,e,a){"use strict";a.d(e,"a",(function(){return n})),a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return s})),a.d(e,"f",(function(){return l})),a.d(e,"d",(function(){return r})),a.d(e,"e",(function(){return c}));var i=a("a27e");function n(t){return Object(i["a"])({url:"/batch/array",method:"post",params:t})}function o(t){return Object(i["a"])({url:"/batch/score/array",method:"post",params:t})}function s(t){return Object(i["a"])({url:"/batch/score/commit",method:"post",params:t})}function l(t){return Object(i["a"])({url:"/batch/score/fire",method:"post",params:t})}function r(t){return Object(i["a"])({url:"/batch/modify",method:"post",params:t})}function c(t){return Object(i["a"])({url:"/batch/score/user/delete",method:"post",params:t})}},8199:function(t,e,a){},ad99:function(t,e,a){"use strict";var i=a("8199"),n=a.n(i);n.a}}]);
//# sourceMappingURL=chunk-4fba1306.10ef49ae.js.map