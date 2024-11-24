(function(e,f){typeof exports=="object"&&typeof module<"u"?f(require("vue")):typeof define=="function"&&define.amd?define(["vue"],f):(e=typeof globalThis<"u"?globalThis:e||self,f(e.Vue))})(this,function(e){"use strict";const f={key:0,class:"popup"},C={class:"popup-content"},w={key:0},F={class:"button-container"},x=e.defineComponent({__name:"Popup",props:{visible:{type:Boolean},closeButtonText:{},eventData:{},popupFields:{}},emits:["close","handleDelete"],setup(y,{emit:p}){const a=y,u=p,b=e.computed(()=>a.popupFields||[]),i=e.computed(()=>a.eventData||{}),E=c=>c.replace(/_/g," ").replace(/\b\w/g,d=>d.toUpperCase()),m=e.computed(()=>b.value.length===0?i.value:Object.keys(i.value).filter(c=>b.value.includes(c)).reduce((c,d)=>(c[d]=i.value[d],c),{})),g=()=>{u("close")},h=()=>{u("handleDelete",i.value.id)};return(c,d)=>c.visible?(e.openBlock(),e.createElementBlock("div",f,[e.createElementVNode("div",C,[i.value&&Object.keys(i.value).length?(e.openBlock(),e.createElementBlock("div",w,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(m.value,(s,k)=>(e.openBlock(),e.createElementBlock("div",{key:k,class:"popup-field"},[e.createElementVNode("p",null,[e.createElementVNode("strong",null,e.toDisplayString(E(String(k)))+":",1),e.createTextVNode(" "+e.toDisplayString(s),1)])]))),128))])):e.renderSlot(c.$slots,"default",{key:1},void 0,!0),e.createElementVNode("div",F,[e.createElementVNode("button",{class:"close-button",onClick:g},e.toDisplayString(c.closeButtonText),1),e.createElementVNode("button",{class:"delete-button",onClick:h}," Delete ")])])])):e.createCommentVNode("",!0)}}),D=(y,p)=>{const a=y.__vccOpts||y;for(const[u,b]of p)a[u]=b;return a},M=D(x,[["__scopeId","data-v-f2be054c"]]),A="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e",W=["for"],z={key:0},$=["id","onUpdate:modelValue"],I=["value"],O={key:1},U=["id","onUpdate:modelValue","type"],q={class:"form-group"},P={for:"start",class:"form-label"},R={class:"form-group"},H={for:"end",class:"form-label"},j={class:"form-group"},Y={for:"date",class:"form-label"},J=["disabled"],K={class:"calendar"},G={class:"navigation"},Q={class:"current-week"},X={class:"hours-and-days"},Z={class:"hours"},v={class:"weekdays-container"},ee={class:"weekdays"},te={class:"days"},le=["onClick"],oe=["src"],V=e.defineComponent({__name:"ScheduleForm",props:{customClass:{},customStyles:{},schedules:{},additionalFields:{},weekdays:{},eventTitleColor:{},eventTitleSize:{},popupFields:{},labelsAndSettings:{}},emits:["submitEvent","handleDelete"],setup(y,{emit:p}){const a=y,u=p,b=e.computed(()=>a.weekdays||["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]),i=e.computed(()=>a.eventTitleColor||"#000"),E=e.computed(()=>a.eventTitleSize||"16px"),m=e.computed(()=>{var o,l,t,n,r;return{startTimeLabel:((o=a.labelsAndSettings)==null?void 0:o.startTimeLabel)||"Start Time",endTimeLabel:((l=a.labelsAndSettings)==null?void 0:l.endTimeLabel)||"End Time",dateLabel:((t=a.labelsAndSettings)==null?void 0:t.dateLabel)||"Date",submitButtonText:((n=a.labelsAndSettings)==null?void 0:n.submitButtonText)||"Add Entry",calendarWeekLabel:((r=a.labelsAndSettings)==null?void 0:r.calendarWeekLabel)||"CW"}}),g=e.ref(a.schedules),h=e.ref(a.additionalFields),c=e.ref(["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]),d=e.ref({}),s=e.ref({start:"",end:"",date:"",color:""}),k=e.ref({visible:!1,event:{}}),_=e.ref(0),ae=async()=>{const o={start:s.value.start,end:s.value.end,date:s.value.date,info:s.value.info,color:s.value.color};a.additionalFields.forEach(l=>{o[l.model]=s.value[l.model]}),u("submitEvent",o),Object.keys(s.value).forEach(l=>{s.value[l]=""})},re=()=>{!h.value.length||!g.value.length||(d.value={},g.value.forEach(o=>{const l=o.date;d.value[l]||(d.value[l]=[]),d.value[l].push(o)}))};e.watchEffect(re);const L=o=>{const l=new Date,t=l.getDay(),n=o+1-t+_.value*7,r=new Date(l);return r.setDate(l.getDate()+n),r.toISOString().substring(0,10)},ce=()=>{const o=new Date,l=new Date(o.getFullYear(),0,1),t=(o.getTime()-l.getTime())/864e5+_.value*7;return Math.ceil((t+l.getDay()+1)/7)},de=()=>_.value-=1,ie=()=>_.value+=1,me=o=>{const l=parseInt(o.start.substring(0,2)),t=parseInt(o.start.substring(3,5)),n=parseInt(o.end.substring(0,2)),r=parseInt(o.end.substring(3,5)),B=l*60+t,N=n*60+r,ke=B*40/60;let T=(N-B)*40/60;return r===0&&(T+=40),{backgroundColor:o.color||"#a4d8ff",top:`${ke}px`,height:`${T}px`,position:"absolute",left:0,right:0,zIndex:1}},pe=o=>{k.value.event=o,k.value.visible=!0},ue=()=>k.value.visible=!1,be=o=>{u("handleDelete",o)};return e.onMounted(()=>{a.additionalFields.forEach(o=>{s.value[o.model]=""})}),(o,l)=>(e.openBlock(),e.createElementBlock("div",{class:e.normalizeClass(o.customClass),style:e.normalizeStyle(o.customStyles)},[e.createElementVNode("form",{class:"form-container",onSubmit:e.withModifiers(ae,["prevent"])},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(h.value,t=>(e.openBlock(),e.createElementBlock("div",{key:t.id,class:"form-group"},[e.createElementVNode("label",{for:t.id,class:"form-label"},e.toDisplayString(t.label)+":",9,W),t.type==="select"?(e.openBlock(),e.createElementBlock("div",z,[e.withDirectives(e.createElementVNode("select",{id:t.id,"onUpdate:modelValue":n=>s.value[t.model]=n,required:"",class:"form-select"},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.options,n=>(e.openBlock(),e.createElementBlock("option",{key:n.id,value:n},e.toDisplayString(n.name||`${n.first_name} ${n.last_name}`),9,I))),128))],8,$),[[e.vModelSelect,s.value[t.model]]])])):(e.openBlock(),e.createElementBlock("div",O,[e.withDirectives(e.createElementVNode("input",{id:t.id,"onUpdate:modelValue":n=>s.value[t.model]=n,type:t.type,required:"",class:"form-input"},null,8,U),[[e.vModelDynamic,s.value[t.model]]])]))]))),128)),e.createElementVNode("div",q,[e.createElementVNode("label",P,e.toDisplayString(m.value.startTimeLabel||"Start Time")+":",1),e.withDirectives(e.createElementVNode("input",{id:"start","onUpdate:modelValue":l[0]||(l[0]=t=>s.value.start=t),type:"time",required:"",class:"form-input"},null,512),[[e.vModelText,s.value.start]])]),e.createElementVNode("div",R,[e.createElementVNode("label",H,e.toDisplayString(m.value.endTimeLabel||"End Time")+":",1),e.withDirectives(e.createElementVNode("input",{id:"end","onUpdate:modelValue":l[1]||(l[1]=t=>s.value.end=t),type:"time",required:"",class:"form-input"},null,512),[[e.vModelText,s.value.end]])]),e.createElementVNode("div",j,[e.createElementVNode("label",Y,e.toDisplayString(m.value.dateLabel||"Date")+":",1),e.withDirectives(e.createElementVNode("input",{id:"date","onUpdate:modelValue":l[2]||(l[2]=t=>s.value.date=t),type:"date",required:"",class:"form-input"},null,512),[[e.vModelText,s.value.date]])]),e.createElementVNode("button",{type:"submit",disabled:!!d.value.processing,class:"submit-button"},e.toDisplayString(m.value.submitButtonText||"Add Entry"),9,J)],32),e.createElementVNode("div",K,[e.createElementVNode("div",G,[e.createElementVNode("button",{class:"arrow-button",onClick:de},"<"),e.createElementVNode("span",Q,e.toDisplayString(m.value.calendarWeekLabel||"CW")+" "+e.toDisplayString(ce()),1),e.createElementVNode("button",{class:"arrow-button",onClick:ie},">")]),e.createElementVNode("div",X,[e.createElementVNode("div",Z,[l[3]||(l[3]=e.createElementVNode("div",{class:"empty-slot"},null,-1)),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(c.value,t=>(e.openBlock(),e.createElementBlock("div",{key:t,class:"hour"},e.toDisplayString(t),1))),128))]),e.createElementVNode("div",v,[e.createElementVNode("ul",ee,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(b.value,(t,n)=>(e.openBlock(),e.createElementBlock("li",{key:n,class:"weekday"},[e.createElementVNode("span",null,e.toDisplayString(t),1),e.createElementVNode("span",null,e.toDisplayString(L(n)),1)]))),128))]),e.createElementVNode("div",te,[(e.openBlock(),e.createElementBlock(e.Fragment,null,e.renderList(7,(t,n)=>e.createElementVNode("div",{key:n,class:"day"},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(c.value,r=>(e.openBlock(),e.createElementBlock("div",{key:r,class:"hour"}))),128)),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(d.value[L(n)]||[],(r,B)=>(e.openBlock(),e.createElementBlock("div",{key:r.id,class:"event",style:e.normalizeStyle(me(r))},[e.createElementVNode("span",{style:e.normalizeStyle({color:i.value,fontSize:E.value})},e.toDisplayString(r.title),5),l[4]||(l[4]=e.createElementVNode("br",null,null,-1)),e.createElementVNode("button",{class:"info-button",onClick:N=>pe(r)},[e.createElementVNode("img",{src:e.unref(A),alt:"my-logo",class:"small-logo"},null,8,oe)],8,le)],4))),128))])),64))])])])]),e.createVNode(M,{visible:k.value.visible,eventData:k.value.event,popupFields:o.popupFields,closeButtonText:"Close",onClose:ue,onHandleDelete:be},null,8,["visible","eventData","popupFields"])],6))}}),ne={class:"wrapper"},se=D({__name:"App",setup(y){const p=e.ref([{id:1,title:"Meeting",date:"2024-11-04",start:"09:00",end:"10:00",teacher:"Malika Heaney",room:"Room 1",color:"#e2Be33"},{id:2,title:"Workshop",date:"2024-11-07",start:"13:00",end:"15:00",teacher:"John Doe",room:"Room 2",color:"#33C3FF"}]),a=e.ref(["title","date","start","end"]),u=e.ref([{id:"teacher",label:"Teacher",type:"text",model:"teacher"},{id:"room",label:"Room",type:"select",model:"room",options:[{id:1,name:"Room 1"},{id:2,name:"Room 2"}]}]),b=e.computed(()=>({startTimeLabel:"Start Time",endTimeLabel:"End Time",dateLabel:"Date",submitButtonText:"Add Event",calendarWeekLabel:"Week"})),i=E=>{p.value=p.value.filter(m=>m.id!==E)};return(E,m)=>(e.openBlock(),e.createElementBlock("div",ne,[e.createVNode(V,{schedules:p.value,"additional-fields":u.value,"custom-class":"customize-schedule-form","labels-and-settings":b.value,"popup-fields":a.value,onDeleteEvent:i},null,8,["schedules","additional-fields","labels-and-settings","popup-fields"])]))}},[["__scopeId","data-v-8f30bfe4"]]),S=e.createApp(se);S.component("ScheduleForm",V),S.mount("#app")});
