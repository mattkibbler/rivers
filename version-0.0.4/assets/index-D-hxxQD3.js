var v=Object.defineProperty;var C=(r,t,e)=>t in r?v(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var o=(r,t,e)=>C(r,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();const y=255;var u=(r=>(r[r.STONE=0]="STONE",r[r.GRASS=1]="GRASS",r[r.DIRT=2]="DIRT",r))(u||{});const x=(r,t)=>{r=r.replace(/^#/,"");let e=parseInt(r.substring(0,2),16),i=parseInt(r.substring(2,4),16),s=parseInt(r.substring(4,6),16);return e=Math.min(255,Math.max(0,Math.floor(e*t))),i=Math.min(255,Math.max(0,Math.floor(i*t))),s=Math.min(255,Math.max(0,Math.floor(s*t))),"#"+((1<<24)+(e<<16)+(i<<8)+s).toString(16).slice(1).toUpperCase()},c=(r,t)=>{const e=document.createElement(r);return t.appendChild(e),e},h=(r,t)=>{for(const e in t)t[e]!==void 0&&(r.style[e]=t[e]);return r},F={[u.STONE]:"#AAAAAA",[u.GRASS]:"#00FF00",[u.DIRT]:"#8B4513"};let S=0;class E{constructor(t,e){o(this,"id");o(this,"el");o(this,"size");o(this,"x");o(this,"y");o(this,"contentEl");o(this,"debugEl",null);this.size=e,this.x=null,this.y=null,this.id=++S,this.el=document.createElement("div"),this.el.style.position="absolute",this.el.style.width=`${e}px`,this.el.style.height=`${e}px`,t.appendChild(this.el),this.el.style.backgroundColor="#000",this.el.style.display="none",this.el.style.fontSize="8px",this.el.style.fontFamily="monospace",this.el.style.color="white",this.contentEl=c("div",this.el),h(this.contentEl,{position:"absolute",top:"0",left:"0",width:`${e}px`,height:`${e}px`,opacity:"0",transition:"opacity .5s ease"})}highlight(t,e="red"){t?this.el.style.border=`1px solid ${e}`:this.el.style.border="none"}showDebug(){this.debugEl=c("div",this.el),h(this.debugEl,{position:"absolute",zIndex:"99",top:"0",right:"0",bottom:"0",left:"0",textAlign:"center",paddingTop:"3px"})}place(t,e){this.el.style.display="block",this.x=t,this.y=e,this.el.style.transform=`translate3d(${this.size*t}px, ${this.size*e}px, 0)`,this.debugEl&&(this.debugEl.innerText=`${this.x},${this.y}`)}release(){this.el.style.display="none",this.contentEl.style.backgroundColor="#000",this.contentEl.style.opacity="0"}setContent(t){this.contentEl.style.backgroundColor=x(F[t.material],1-t.zLevel/y),this.contentEl.style.opacity="1"}}function R(r,t){let e,i;return function(...s){const n=this;i?(clearTimeout(e),e=setTimeout(function(){Date.now()-i>=t&&(r.apply(n,s),i=Date.now())},t-(Date.now()-i))):(r.apply(n,s),i=Date.now())}}const w=["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF","#800000","#008000","#000080","#808000","#008080","#800080","#FF4500","#2E8B57","#B22222","#FF6347","#4682B4","#FF1493","#FF69B4","#00CED1","#1E90FF","#FFD700","#FF8C00","#ADFF2F","#9932CC","#8A2BE2","#FF00FF","#9400D3","#32CD32","#7FFF00","#FFA500","#DC143C","#00BFFF","#FF4500","#00FA9A","#FFB6C1","#DA70D6","#20B2AA","#40E0D0","#87CEEB","#6A5ACD","#FFFFE0","#BA55D3","#FFDEAD","#D2691E","#8B4513","#228B22","#5F9EA0","#FFDAB9","#B0E0E6"],g={};class T{constructor(t,e,i,s){o(this,"offset");o(this,"viewPane");o(this,"tileMap");o(this,"tilePool");o(this,"visibleContentRegion");o(this,"scheduleUpdateVisibleContentRegion");o(this,"debugRegions",[]);o(this,"tileContainer");o(this,"tileSize");o(this,"regionSize");o(this,"tileRegionResolver");this.tileContainer=t,this.tileSize=e,this.regionSize=i,this.tileRegionResolver=s,this.offset={x:0,y:0},this.tileMap=new Map,this.tilePool=[],this.visibleContentRegion=null,this.scheduleUpdateVisibleContentRegion=R(this.updateVisibleContentRegion,500),this.viewPane=document.createElement("div"),this.viewPane.setAttribute("id","rendererViewPane"),this.tileContainer.appendChild(this.viewPane)}clearDebugRegions(){for(let t=0;t<this.debugRegions.length;t++)this.debugRegions[t].remove();this.debugRegions=[]}drawDebugRegions(t){for(let e=0;e<t.length;e++){const i=c("div",this.viewPane);h(i,{position:"absolute",left:`${t[e].startX*this.tileSize}px`,top:`${t[e].startY*this.tileSize}px`,width:`${(t[e].endX-t[e].startX)*this.tileSize}px`,height:`${(t[e].endY-t[e].startY)*this.tileSize}px`,border:`1px solid ${w[this.debugRegions.length]}`}),this.debugRegions.push(i)}}setOffset(t){this.offset.x=t.x,this.offset.y=t.y,this.viewPane.style.transform=`translateX(${this.offset.x}px) translateY(${this.offset.y}px)`}setVisibleRegion(t){this.visibleContentRegion;for(const e of this.tileMap.values())e.x!==null&&e.y!==null&&(e.x<t.startX||e.y<t.startY||e.x>t.endX||e.y>t.endY)&&this.removeTile(e);for(let e=t.startX;e<=t.endX;e++)for(let i=t.startY;i<=t.endY;i++)this.addTile(e,i);this.visibleContentRegion===null?this.updateVisibleContentRegion(t):this.scheduleUpdateVisibleContentRegion(t)}updateVisibleContentRegion(t){const e=[],i=Math.floor(t.startX/this.regionSize),s=Math.floor(t.startY/this.regionSize),n=Math.floor((t.endX+this.regionSize-1)/this.regionSize),l=Math.floor((t.endY+this.regionSize-1)/this.regionSize);for(let a=i;a<=n;a++)for(let d=s;d<=l;d++)e.push({startX:a*this.regionSize,startY:d*this.regionSize,endX:a*this.regionSize+this.regionSize,endY:d*this.regionSize+this.regionSize});this.tileRegionResolver.resolve(e).then(this.setTileRegionContent.bind(this)),this.visibleContentRegion=t}removeTile(t){t.release(),this.tilePool.push(t),this.tileMap.delete(`${t.x},${t.y}`)}addTile(t,e){var s;const i=`${t},${e}`;this.tileMap.has(i)||(this.tileMap.set(i,this.getTile(t,e)),this.visibleContentRegion&&t>=this.visibleContentRegion.startX&&t<=this.visibleContentRegion.endX&&e>=this.visibleContentRegion.startY&&e<=this.visibleContentRegion.endY&&((s=this.tileMap.get(i))==null||s.setContent(g[i])))}getTile(t,e){const i=this.tilePool.length>0?this.tilePool.pop():new E(this.viewPane,this.tileSize);return i.place(t,e),i}setTileRegionContent(t){for(let e=0;e<t.length;e++){let i=0,s=0;for(let n=t[e].region.startY;n<=t[e].region.endY;n++){s=0;for(let l=t[e].region.startX;l<=t[e].region.endX;l++){const a=`${l},${n}`;g[a]=t[e].data[i][s],this.tileMap.has(a)&&this.tileMap.get(a).setContent(t[e].data[i][s]),s+=1}i+=1}}}}const M=void 0,O={apiUrl:M},z=r=>{const t=Object.values(r).filter(i=>typeof i=="number"),e=Math.floor(Math.random()*t.length);return t[e]};class ${constructor(t,e,i){o(this,"data");o(this,"max");o(this,"timeout");o(this,"timer",null);o(this,"handler");if(t<=0)throw new Error("max must be a positive number greater than 0");if(e<0)throw new Error("timeout must be a positive number");this.data=[],this.max=t,this.timeout=e,this.handler=i}add(t){this.timer&&clearTimeout(this.timer),this.timer=setTimeout(()=>{this.flush()},this.timeout),this.data.push(t),this.data.length>=this.max&&this.flush()}flush(){this.handler([...this.data]),this.data.length=0}}const p={};class X{constructor(){o(this,"buffer");this.buffer=new $(200,250,t=>{setTimeout(()=>{for(let e=0;e<t.length;e++){if(t[e][2].x!==t[e][0]&&t[e][2].y!==t[e][1])continue;const i=`${t[e][0]},${t[e][1]}`;p[i]||(p[i]=this.generateTile(t[e][0],t[e][1])),t[e][2].setContent(p[i])}},500)})}loadTileData(t,e,i){this.buffer.add([t,e,i])}loadTileRegions(t){return new Promise(async e=>{let i="?";for(let l=0;l<t.length;l++)i+=i?"&":"",i+=`regions[]=${t[l].startX},${t[l].startY},${t[l].endX},${t[l].endY}`;const s=await fetch(`${O.apiUrl}/api/v1/tiles/regions${i}`,{headers:{Accept:"application/json"}});if(!s.ok)throw new Error("could not get tile regions");const n=await s.json();e(n.packets)})}getTile(t,e){const i=`${t},${e}`;return p[i]||(p[i]=this.generateTile(t,e)),p[i]}generateTile(t,e){return{zLevel:0,material:z(u)}}}const f={};class A{loadTileRegions(t){return new Promise(e=>{const i=[];for(let s=0;s<t.length;s++){const n=`${t[s].startX},${t[s].startY},${t[s].endX},${t[s].endY}`;f[n]&&i.push(f[n])}e(i)})}storeRegions(t){for(let e=0;e<t.length;e++){const i=`${t[e].region.startX},${t[e].region.startY},${t[e].region.endX},${t[e].region.endY}`;f[i]=t[e]}}}class Y{constructor(t,e){o(this,"cache");o(this,"service");this.cache=t,this.service=e}async resolve(t){const e=[],i=[...t],s=await this.cache.loadTileRegions(i);for(let n=0;n<s.length;n++){const l=i.findIndex(a=>a.startX===s[n].region.startX&&a.startY===s[n].region.startY&&a.endX===s[n].region.endX&&a.endY===s[n].region.endY);l>-1&&i.splice(l,1)}if(e.push(...s),i.length>0){const n=await this.service.loadTileRegions(i);e.push(...n),this.cache.storeRegions(n)}return e}}class L{constructor(t){o(this,"appContainer");o(this,"mouseMoveStart");o(this,"viewport");o(this,"lastScrollOffset");o(this,"scrollOffset");o(this,"tileSize",20);o(this,"regionSize",20);o(this,"renderer");o(this,"padding",1);o(this,"helperTextContainer");o(this,"tileContainer");o(this,"tileContainerFrame");o(this,"movementEnabled",!1);o(this,"tileService");o(this,"tileCache");this.appContainer=t,this.mouseMoveStart=null,this.viewport={width:t.clientWidth,height:t.clientHeight},this.lastScrollOffset={x:0,y:0},this.scrollOffset={x:0,y:0},this.tileContainer=this.createTileContainer(),this.tileContainerFrame=this.createTileContainerFrame(),this.helperTextContainer=this.createHelperTextContainer(),this.viewport.width=this.tileContainer.clientWidth,this.viewport.height=this.tileContainer.clientHeight,this.tileService=new X,this.tileCache=new A,this.renderer=new T(this.tileContainer,this.tileSize,this.regionSize,new Y(this.tileCache,this.tileService)),this.enableMovement(),this.addListeners()}enableMovement(){this.appContainer.style.cursor="grab",this.movementEnabled=!0}disableMovement(){this.appContainer.style.cursor="default",this.movementEnabled=!1}createHelperTextContainer(){var l;const t=c("div",this.appContainer),e=c("p",t),i=c("p",t),s=c("button",i),n=c("dialog",i);return e.innerText="Click and drag around the screen to explore the map.",s.innerText="What is this?",n.innerHTML=`
			<p>An exerimental tile-based map exploring the creation of rivers and other water features... water coming soon.</p>
			<p>This latest iteration introduces asynchronous loading of tiles and generation of basic tile material colours.</p>
			<p>Tile loading is all local at the moment with a short delay to simulate a call to a server.</p>
			<h3>Next steps</h3>
			<ul style="list-style-position: inside">
				<li>Create a backend to generate and persist tile creation</li>
				<li>Generate less random, more coherent tile sets</li>
			</ul>
			<p><a href="https://github.com/mattkibbler/rivers">More information on Github</a></p>
			<h3>Previous versions</h3>
			<p><a href="https://mattkibbler.github.io/rivers/version-0.0.2/">v0.0.2</a></p>
			<p><a href="https://mattkibbler.github.io/rivers/version-0.0.1/">v0.0.1</a></p>
			<p><button type="button">Close</button></p>
		`,s.addEventListener("click",()=>{this.disableMovement(),n.showModal()}),(l=n.querySelector("button"))==null||l.addEventListener("click",a=>{a.preventDefault(),this.enableMovement(),n.close()}),h(n.querySelector("button"),{fontFamily:"monospace",fontSize:"12px"}),h(t,{fontFamily:"monospace",textAlign:"center",position:"absolute",bottom:"0px",left:"0px",right:"0px",padding:"20px"}),h(e,{background:"#FFF",display:"inline-block",paddingLeft:"4px",paddingRight:"4px",marginTop:"0px",marginBottom:"0px"}),h(i,{marginTop:"10px",marginBottom:"0px"}),h(s,{fontFamily:"monospace",fontSize:"12px"}),h(n,{lineHeight:"1.3rem"}),t}createTileContainer(){const t=c("div",this.appContainer);return t.setAttribute("id","tileContainer"),h(t,{position:"absolute",left:"25%",right:"25%",bottom:"25%",top:"25%"}),t}createTileContainerFrame(){const t=c("div",this.appContainer);return t.setAttribute("id","tileContainerFrame"),h(t,{position:"absolute",left:"25%",right:"25%",bottom:"25%",top:"25%",border:"2px solid red"}),t}addListeners(){const t=n=>{if(!this.movementEnabled)return;const l="touches"in n?n.touches[0].clientX:n.clientX,a="touches"in n?n.touches[0].clientY:n.clientY;this.mouseMoveStart={x:l,y:a},this.appContainer.style.cursor="grabbing"},e=()=>{this.movementEnabled&&(this.mouseMoveStart=null,this.lastScrollOffset={x:this.scrollOffset.x,y:this.scrollOffset.y},this.renderer.setOffset(this.scrollOffset),this.appContainer.style.cursor="grab")},i=n=>{if(!this.movementEnabled||this.mouseMoveStart===null)return;const l="touches"in n?n.touches[0].clientX:n.clientX,a="touches"in n?n.touches[0].clientY:n.clientY;this.scrollOffset.x=this.lastScrollOffset.x+(l-this.mouseMoveStart.x),this.scrollOffset.y=this.lastScrollOffset.y+(a-this.mouseMoveStart.y),this.renderer.setOffset(this.scrollOffset),this.renderer.setVisibleRegion(this.calculateVisibleRegion())};this.appContainer.addEventListener("mousedown",t),this.appContainer.addEventListener("mouseup",e),this.appContainer.addEventListener("mousemove",i),this.appContainer.addEventListener("touchstart",t),this.appContainer.addEventListener("touchend",e),this.appContainer.addEventListener("touchmove",i),new ResizeObserver(n=>{this.viewport.width=n[0].contentRect.width,this.viewport.height=n[0].contentRect.height,this.renderer.setVisibleRegion(this.calculateVisibleRegion())}).observe(this.tileContainer)}calculateVisibleRegion(){const t={x:this.scrollOffset.x+this.tileSize*this.padding,y:this.scrollOffset.y+this.tileSize*this.padding},e={width:this.viewport.width+this.tileSize*(2*this.padding),height:this.viewport.height+this.tileSize*(2*this.padding)},i=-t.x/this.tileSize,s=-t.y/this.tileSize,n=Math.floor(e.width/this.tileSize),l=Math.floor(e.height/this.tileSize),a=Math.floor(i),d=Math.floor(s),m=Math.ceil(i+n),b=Math.ceil(s+l);return{startX:a,startY:d,endX:m,endY:b}}start(){}}const D=new L(document.querySelector("#app"));D.start();
