function g(n,e,t,a,i,s,u,h){var l=typeof n=="function"?n.options:n;e&&(l.render=e,l.staticRenderFns=t,l._compiled=!0),a&&(l.functional=!0),s&&(l._scopeId="data-v-"+s);var o;if(u?(o=function(r){r=r||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!r&&typeof __VUE_SSR_CONTEXT__<"u"&&(r=__VUE_SSR_CONTEXT__),i&&i.call(this,r),r&&r._registeredComponents&&r._registeredComponents.add(u)},l._ssrRegister=o):i&&(o=h?function(){i.call(this,(l.functional?this.parent:this).$root.$options.shadowRoot)}:i),o)if(l.functional){l._injectStyles=o;var d=l.render;l.render=function(m,c){return o.call(c),d(m,c)}}else{var f=l.beforeCreate;l.beforeCreate=f?[].concat(f,o):[o]}return{exports:n,options:l}}const p=/\{\{\s*([a-z0-9]*)\s*\}\}/i,y={mixins:[Fieldtype],data(){return{spec:this.meta.spec,linkValue:this.meta.initialLink,queryValue:this.meta.initialQuery,fragmentValue:this.meta.initialFragment,queryTemplate:null,queryTemplateAffix:null,fragmentTemplate:null,fragmentTemplateAffix:null,loading:!1}},created(){Statamic.$hooks.on("entry.saved",(n,e)=>{this.spec&&(this.spec.discovered=!1),n()})},computed:{returnValue(){if(!this.linkValue)return null;const n=new URL(this.linkValue);return this.queryValue?n.search=`?${this.queryValue}`:n.search="",this.fragmentValue?n.hash=`#${this.fragmentValue}`:n.hash="",n.toString()},queryOptions(){const n=this.prepareOptions(this.spec.queries||{});return this.loading&&n.unshift({value:"__loading__",label:null,title:null,template:!0,loading:!0}),n},fragmentOptions(){const n=this.prepareOptions(this.spec.fragments||{});return this.loading&&n.unshift({value:"__loading__",label:null,title:null,template:!0,loading:!0}),n},queryEnabled(){return this.spec&&this.spec.queries},fragmentEnabled(){return this.spec&&(this.spec.fragments||this.spec.discovery)},bothEnabled(){return this.queryEnabled&&this.fragmentEnabled},eitherEnabled(){return this.queryEnabled||this.fragmentEnabled},discoveryPending(){return!this.spec||this.spec.discovery&&!this.spec.discovered},toggleVisible(){return!1},fieldsVisible(){return this.linkValue}},methods:{linkChanged(n){this.linkValue=n,this.queryValue=null,this.fragmentValue=null,this.queryTemplate=null,this.fragmentTemplate=null,this.spec=null,this.update(this.returnValue),this.linkChangedDebounced()},linkChangedDebounced:_.debounce(function(){if(this.linkValue){const n=new URL(this.linkValue);n.search.length&&(this.queryValue=n.search.substr(1)),n.hash.length&&(this.fragmentValue=n.hash.substr(1))}this.$nextTick(()=>this.fetchSpec())},500),queryChanged(n){if(n==="__loading__")return;const e=this.prepareTemplate("query",n);if(e){const[t,a,i,s]=e;this.queryTemplate=t,this.queryTemplateAffix=[a,i],this.$nextTick(s)}else this.queryValue=n,this.update(this.returnValue)},fragmentChanged(n){if(n==="__loading__")return;const e=this.prepareTemplate("fragment",n);if(e){const[t,a,i,s]=e;this.fragmentTemplate=t,this.fragmentTemplateAffix=[a,i],this.$nextTick(s)}else this.fragmentValue=n,this.update(this.returnValue)},isTemplate(n){return p.exec(n)!==null},prepareTemplate(n,e){const t=p.exec(e);if(t===null)return;const a=t[1],i=e.substr(0,t.index),s=e.substr(t.index+t[0].length);return[a,i,s,()=>{const u=this.$refs[`${n}_template`].$refs.input;u.focus(),u.setSelectionRange(0,t[1].length)}]},queryTemplateCommit(){if(!this.queryTemplate)return;const n=encodeURIComponent(this.queryTemplate),[e,t]=this.queryTemplateAffix;this.queryValue=`${e}${n}${t}`,this.queryTemplate=null,this.queryTemplateAffix=null,this.update(this.returnValue)},fragmentTemplateCommit(){if(!this.fragmentTemplate)return;const n=encodeURIComponent(this.fragmentTemplate),[e,t]=this.fragmentTemplateAffix;this.fragmentValue=`${e}${n}${t}`,this.fragmentTemplate=null,this.fragmentTemplateAffix=null,this.update(this.returnValue)},selectOpen(){this.discoveryPending&&this.fetchSpec(!0)},fetchSpec(n=!1){const{specCache:e,discoverCache:t}=window.StatamicFocalLink,a=n?t:e,i=this.linkValue;if(i!==null){if(a[i]){this.spec=a[i];return}this.loading=!0,this.$axios.get(cp_url("focal-link/spec"),{params:{value:i,discover:n}}).then(s=>{this.spec=s.data,a[i]=this.spec}).catch(s=>{}).finally(s=>{this.loading=!1})}},prepareOptions(n){return Object.entries(n).map(([e,t])=>(this.isTemplate(e)&&(t=`${t}…`),{value:e,label:e,title:t,loading:!1}))}}};var x=function(){var e=this,t=e._self._c;return t("div",{staticClass:"flex flex-col"},[t("div",{staticClass:"space-x-1 flex items-center"},[t(`${e.meta.nestedType}-fieldtype`,{ref:"link",tag:"component",staticClass:"flex-1",attrs:{handle:"link",value:e.linkValue,config:e.meta.link.config,meta:e.meta.link.meta},on:{input:e.linkChanged,"meta-updated":function(a){e.meta.link.meta=a}}})],1),e.fieldsVisible?t("div",{staticClass:"mt-2 flex items-center"},[t("div",{staticClass:"w-28 mr-4 flex-shrink-0 text-right"}),e.queryEnabled?t("div",{staticClass:"fcl-input flex-1 flex items-center"},[t("div",{staticClass:"fcl-prefix text-grey-60"},[e._v("?")]),e.queryTemplate?e._e():t("v-select",{ref:"query",staticClass:"flex-1",attrs:{"append-to-body":"",placeholder:e.__("query"),value:e.queryValue,reduce:a=>a.value,"create-option":a=>({value:a,label:a,title:null}),clearable:!0,options:e.queryOptions,searchable:!0,taggable:!0,"close-on-select":!0},on:{input:e.queryChanged,open:e.selectOpen},scopedSlots:e._u([{key:"option",fn:function(a){return[a.loading?e._e():t("div",{class:e.bothEnabled?"flex flex-col":"flex flex-wrap justify-between"},[t("span",[e._v(e._s(a.label))]),t("strong",[e._v(e._s(a.title))])]),a.loading?t("div",{staticClass:"fcl-loading"},[e.loading?t("loading-graphic",{attrs:{inline:!0,text:e.__("Searching…")}}):e._e()],1):e._e()]}},{key:"no-options",fn:function(){return[t("div",{staticClass:"text-sm text-grey-70 text-left py-2 px-4",domProps:{textContent:e._s(e.__("No options to choose from."))}})]},proxy:!0}],null,!1,329701207)}),e.queryTemplate?t("text-input",{ref:"query_template",staticClass:"flex-1",attrs:{prepend:e.queryTemplateAffix[0],append:e.queryTemplateAffix[1]},on:{keydown:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.queryTemplateCommit.apply(null,arguments)},blur:e.queryTemplateCommit},model:{value:e.queryTemplate,callback:function(a){e.queryTemplate=a},expression:"queryTemplate"}}):e._e()],1):e._e(),e.fragmentEnabled?t("div",{staticClass:"fcl-input flex-1 flex items-center"},[t("div",{staticClass:"fcl-prefix text-grey-60"},[e._v("#")]),e.fragmentTemplate?e._e():t("v-select",{ref:"fragment",staticClass:"flex-1",attrs:{"append-to-body":"",placeholder:e.__("fragment"),value:e.fragmentValue,reduce:a=>a.value,"create-option":a=>({value:a,label:a,title:null}),clearable:!0,options:e.fragmentOptions,searchable:!0,taggable:!0,"close-on-select":!0},on:{input:e.fragmentChanged,open:e.selectOpen},scopedSlots:e._u([{key:"option",fn:function(a){return[a.loading?e._e():t("div",{class:e.bothEnabled?"flex flex-col":"flex flex-wrap justify-between"},[t("span",[e._v(e._s(a.label))]),t("strong",[e._v(e._s(a.title))])]),a.loading?t("div",{staticClass:"fcl-loading"},[e.loading?t("loading-graphic",{attrs:{inline:!0,text:e.__("Searching…")}}):e._e()],1):e._e()]}},{key:"no-options",fn:function(){return[t("div",{staticClass:"text-sm text-grey-70 text-left py-2 px-4",domProps:{textContent:e._s(e.__("No options to choose from."))}})]},proxy:!0}],null,!1,329701207)}),e.fragmentTemplate?t("text-input",{ref:"fragment_template",staticClass:"flex-1",attrs:{prepend:e.fragmentTemplateAffix[0],append:e.fragmentTemplateAffix[1]},on:{keydown:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.fragmentTemplateCommit.apply(null,arguments)},blur:e.fragmentTemplateCommit},model:{value:e.fragmentTemplate,callback:function(a){e.fragmentTemplate=a},expression:"fragmentTemplate"}}):e._e()],1):e._e(),e.eitherEnabled?e._e():t("div",{staticClass:"flex-1 p-2 rounded border border-grey-40 bg-grey-10 flex justify-center items-center fcl-height"},[e.loading?e._e():t("span",{staticClass:"text-sm text-grey",domProps:{textContent:e._s(e.__("No additional options."))}}),e.loading?t("loading-graphic",{attrs:{inline:!0,text:"Loading…"}}):e._e()],1)]):e._e()])},T=[],C=g(y,x,T,!1,null,null,null,null);const b=C.exports;window.StatamicFocalLink={specCache:{},discoverCache:{}};Statamic.booting(()=>{Statamic.$components.register("focal_link-fieldtype",b),Statamic.$hooks.on("entry.saved",(n,e)=>{window.StatamicFocalLink.discoverCache={},n()})});