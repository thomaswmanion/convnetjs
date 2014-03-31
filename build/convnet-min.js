var convnetjs=convnetjs||{REVISION:"ALPHA"};(function(c){var h=false;var d=0;var i=function(){if(h){h=false;return d}var k=2*Math.random()-1;var j=2*Math.random()-1;var l=k*k+j*j;if(l==0||l>1){return i()}var m=Math.sqrt(-2*Math.log(l)/l);d=j*m;h=true;return k*m};var g=function(k,j){return Math.random()*(j-k)+k};var f=function(k,j){return Math.floor(Math.random()*(j-k)+k)};var b=function(k,j){return k+i()*j};var e=function(l){if(typeof(l)==="undefined"||isNaN(l)){return[]}if(typeof ArrayBuffer==="undefined"){var j=new Array(l);for(var k=0;k<l;k++){j[k]=0}return j}else{return new Float64Array(l)}};var a=function(k){if(k.length===0){return{}}var j=k[0];var m=k[0];var l=0;var p=0;var q=k.length;for(var o=1;o<q;o++){if(k[o]>j){j=k[o];l=o}if(k[o]<m){m=k[o];p=o}}return{maxi:l,maxv:j,mini:p,minv:m,dv:j-m}};c.randf=g;c.randi=f;c.randn=b;c.zeros=e;c.maxmin=a})(convnetjs);(function(b){var a=function(k,g,f,j){this.sx=k;this.sy=g;this.depth=f;var h=k*g*f;this.w=b.zeros(h);this.dw=b.zeros(h);if(typeof j==="undefined"){var e=Math.sqrt(1/(k*g*f));for(var d=0;d<h;d++){this.w[d]=b.randn(0,e)}}else{for(var d=0;d<h;d++){this.w[d]=j}}};a.prototype={get:function(c,g,f){var e=((this.sx*g)+c)*this.depth+f;return this.w[e]},set:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.w[e]=f},add:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.w[e]+=f},get_grad:function(c,g,f){var e=((this.sx*g)+c)*this.depth+f;return this.dw[e]},set_grad:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.dw[e]=f},add_grad:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.dw[e]+=f},cloneAndZero:function(){return new a(this.sx,this.sy,this.depth,0)},clone:function(){var c=new a(this.sx,this.sy,this.depth,0);var e=this.w.length;for(var d=0;d<e;d++){c.w[d]=this.w[d]}return c},addFrom:function(c){for(var d=0;d<this.w.length;d++){this.w[d]+=c.w[d]}},addFromScaled:function(d,c){for(var e=0;e<this.w.length;e++){this.w[e]+=c*d.w[e]}},setConst:function(c){for(var d=0;d<this.w.length;d++){this.w[d]=c}},toJSON:function(){var c={};c.sx=this.sx;c.sy=this.sy;c.depth=this.depth;c.w=this.w;return c},fromJSON:function(d){this.sx=d.sx;this.sy=d.sy;this.depth=d.depth;var e=this.sx*this.sy*this.depth;this.w=b.zeros(e);this.dw=b.zeros(e);for(var c=0;c<e;c++){this.w[c]=d.w[c]}}};b.Vol=a})(convnetjs);(function(c){var a=c.Vol;var b=function(f,h,n,m,g){if(typeof(g)==="undefined"){var g=false}if(typeof(n)==="undefined"){var n=c.randi(0,f.sx-h)}if(typeof(m)==="undefined"){var m=c.randi(0,f.sy-h)}var e;if(h!==f.sx||n!==0||m!==0){e=new a(h,h,f.depth,0);for(var l=0;l<h;l++){for(var k=0;k<h;k++){if(l+n<0||l+n>=f.sx||k+m<0||k+m>=f.sy){continue}for(var j=0;j<f.depth;j++){e.set(l,k,j,f.get(l+n,k+m,j))}}}}else{e=f}if(g){var i=e.cloneAndZero();for(var l=0;l<e.sx;l++){for(var k=0;k<e.sy;k++){for(var j=0;j<e.depth;j++){i.set(l,k,j,e.get(e.sx-l-1,k,j))}}}e=i}return e};var d=function(o,n){if(typeof(n)==="undefined"){var n=false}var h=document.createElement("canvas");h.width=o.width;h.height=o.height;var u=h.getContext("2d");try{u.drawImage(o,0,0)}catch(q){if(q.name==="NS_ERROR_NOT_AVAILABLE"){return false}else{throw q}}try{var v=u.getImageData(0,0,h.width,h.height)}catch(q){if(q.name==="IndexSizeError"){return false}else{throw q}}var g=v.data;var k=o.width;var s=o.height;var t=[];for(var m=0;m<g.length;m++){t.push(g[m]/255-0.5)}var r=new a(k,s,4,0);r.w=t;if(n){var f=new a(k,s,1,0);for(var m=0;m<k;m++){for(var l=0;l<s;l++){f.set(m,l,0,r.get(m,l,0))}}r=f}return r};c.augment=b;c.img_to_vol=d})(convnetjs);(function(c){var a=c.Vol;var d=function(f){var f=f||{};this.out_depth=f.filters;this.sx=f.sx;this.in_depth=f.in_depth;this.in_sx=f.in_sx;this.in_sy=f.in_sy;this.sy=typeof f.sy!=="undefined"?f.sy:this.sx;this.stride=typeof f.stride!=="undefined"?f.stride:1;this.pad=typeof f.pad!=="undefined"?f.pad:0;this.l1_decay_mul=typeof f.l1_decay_mul!=="undefined"?f.l1_decay_mul:0;this.l2_decay_mul=typeof f.l2_decay_mul!=="undefined"?f.l2_decay_mul:1;this.out_sx=Math.floor((this.in_sx+this.pad*2-this.sx)/this.stride+1);this.out_sy=Math.floor((this.in_sy+this.pad*2-this.sy)/this.stride+1);this.layer_type="conv";this.filters=[];for(var e=0;e<this.out_depth;e++){this.filters.push(new a(this.sx,this.sy,this.in_depth))}this.biases=new a(1,1,this.out_depth,0.1)};d.prototype={forward:function(l,s){this.in_act=l;var j=new a(this.out_sx,this.out_sy,this.out_depth,0);for(var o=0;o<this.out_depth;o++){var n=this.filters[o];var r=-this.pad;var p=-this.pad;for(var e=0;e<this.out_sx;r+=this.stride,e++){p=-this.pad;for(var t=0;t<this.out_sy;p+=this.stride,t++){var q=0;for(var m=0;m<n.sx;m++){for(var k=0;k<n.sy;k++){for(var i=0;i<n.depth;i++){var g=p+k;var h=r+m;if(g>=0&&g<l.sy&&h>=0&&h<l.sx){q+=n.w[((n.sx*k)+m)*n.depth+i]*l.w[((l.sx*g)+h)*l.depth+i]}}}}q+=this.biases.w[o];j.set(e,t,o,q)}}}this.out_act=j;return this.out_act},backward:function(){var k=this.in_act;k.dw=c.zeros(k.w.length);for(var n=0;n<this.out_depth;n++){var m=this.filters[n];var q=-this.pad;var p=-this.pad;for(var e=0;e<this.out_sx;q+=this.stride,e++){p=-this.pad;for(var t=0;t<this.out_sy;p+=this.stride,t++){var o=this.out_act.get_grad(e,t,n);for(var l=0;l<m.sx;l++){for(var j=0;j<m.sy;j++){for(var i=0;i<m.depth;i++){var g=p+j;var h=q+l;if(g>=0&&g<k.sy&&h>=0&&h<k.sx){var s=((k.sx*g)+h)*k.depth+i;var r=((m.sx*j)+l)*m.depth+i;m.dw[r]+=k.w[s]*o;k.dw[s]+=m.w[r]*o}}}}this.biases.dw[n]+=o}}}},getParamsAndGrads:function(){var e=[];for(var f=0;f<this.out_depth;f++){e.push({params:this.filters[f].w,grads:this.filters[f].dw,l2_decay_mul:this.l2_decay_mul,l1_decay_mul:this.l1_decay_mul})}e.push({params:this.biases.w,grads:this.biases.dw,l1_decay_mul:0,l2_decay_mul:0});return e},toJSON:function(){var f={};f.sx=this.sx;f.sy=this.sy;f.stride=this.stride;f.in_depth=this.in_depth;f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.l1_decay_mul=this.l1_decay_mul;f.l2_decay_mul=this.l2_decay_mul;f.pad=this.pad;f.filters=[];for(var e=0;e<this.filters.length;e++){f.filters.push(this.filters[e].toJSON())}f.biases=this.biases.toJSON();return f},fromJSON:function(g){this.out_depth=g.out_depth;this.out_sx=g.out_sx;this.out_sy=g.out_sy;this.layer_type=g.layer_type;this.sx=g.sx;this.sy=g.sy;this.stride=g.stride;this.in_depth=g.in_depth;this.filters=[];this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:1;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.pad=typeof g.pad!=="undefined"?g.pad:0;for(var f=0;f<g.filters.length;f++){var e=new a(0,0,0,0);e.fromJSON(g.filters[f]);this.filters.push(e)}this.biases=new a(0,0,0,0);this.biases.fromJSON(g.biases)}};var b=function(g){var g=g||{};this.out_depth=typeof g.num_neurons!=="undefined"?g.num_neurons:g.filters;this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:0;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.num_inputs=g.in_sx*g.in_sy*g.in_depth;this.out_sx=1;this.out_sy=1;this.layer_type="fc";var e=typeof g.bias_pref!=="undefined"?g.bias_pref:0.1;this.filters=[];for(var f=0;f<this.out_depth;f++){this.filters.push(new a(1,1,this.num_inputs))}this.biases=new a(1,1,this.out_depth,e)};b.prototype={forward:function(h,l){this.in_act=h;var f=new a(1,1,this.out_depth,0);var k=h.w;for(var j=0;j<this.out_depth;j++){var g=0;var e=this.filters[j].w;for(var m=0;m<this.num_inputs;m++){g+=k[m]*e[m]}g+=this.biases.w[j];f.w[j]=g}this.out_act=f;return this.out_act},backward:function(){var e=this.in_act;e.dw=c.zeros(e.w.length);for(var f=0;f<this.out_depth;f++){var h=this.filters[f];var g=this.out_act.dw[f];for(var j=0;j<this.num_inputs;j++){e.dw[j]+=h.w[j]*g;h.dw[j]+=e.w[j]*g}this.biases.dw[f]+=g}},getParamsAndGrads:function(){var e=[];for(var f=0;f<this.out_depth;f++){e.push({params:this.filters[f].w,grads:this.filters[f].dw,l1_decay_mul:this.l1_decay_mul,l2_decay_mul:this.l2_decay_mul})}e.push({params:this.biases.w,grads:this.biases.dw,l1_decay_mul:0,l2_decay_mul:0});return e},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.num_inputs=this.num_inputs;f.l1_decay_mul=this.l1_decay_mul;f.l2_decay_mul=this.l2_decay_mul;f.filters=[];for(var e=0;e<this.filters.length;e++){f.filters.push(this.filters[e].toJSON())}f.biases=this.biases.toJSON();return f},fromJSON:function(g){this.out_depth=g.out_depth;this.out_sx=g.out_sx;this.out_sy=g.out_sy;this.layer_type=g.layer_type;this.num_inputs=g.num_inputs;this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:1;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.filters=[];for(var f=0;f<g.filters.length;f++){var e=new a(0,0,0,0);e.fromJSON(g.filters[f]);this.filters.push(e)}this.biases=new a(0,0,0,0);this.biases.fromJSON(g.biases)}};c.ConvLayer=d;c.FullyConnLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.sx=d.sx;this.in_depth=d.in_depth;this.in_sx=d.in_sx;this.in_sy=d.in_sy;this.sy=typeof d.sy!=="undefined"?d.sy:this.sx;this.stride=typeof d.stride!=="undefined"?d.stride:2;this.pad=typeof d.pad!=="undefined"?d.pad:0;this.out_depth=this.in_depth;this.out_sx=Math.floor((this.in_sx+this.pad*2-this.sx)/this.stride+1);this.out_sy=Math.floor((this.in_sy+this.pad*2-this.sy)/this.stride+1);this.layer_type="pool";this.switchx=c.zeros(this.out_sx*this.out_sy*this.out_depth);this.switchy=c.zeros(this.out_sx*this.out_sy*this.out_depth)};b.prototype={forward:function(l,u){this.in_act=l;var h=new a(this.out_sx,this.out_sy,this.out_depth,0);var i=0;for(var p=0;p<this.out_depth;p++){var s=-this.pad;var q=-this.pad;for(var e=0;e<this.out_sx;s+=this.stride,e++){q=-this.pad;for(var w=0;w<this.out_sy;q+=this.stride,w++){var r=-99999;var o=-1,k=-1;for(var m=0;m<this.sx;m++){for(var j=0;j<this.sy;j++){var f=q+j;var g=s+m;if(f>=0&&f<l.sy&&g>=0&&g<l.sx){var t=l.get(g,f,p);if(t>r){r=t;o=g;k=f}}}}this.switchx[i]=o;this.switchy[i]=k;i++;h.set(e,w,p,r)}}}this.out_act=h;return this.out_act},backward:function(){var h=this.in_act;h.dw=c.zeros(h.w.length);var f=this.out_act;var g=0;for(var j=0;j<this.out_depth;j++){var l=-this.pad;var k=-this.pad;for(var e=0;e<this.out_sx;l+=this.stride,e++){k=-this.pad;for(var m=0;m<this.out_sy;k+=this.stride,m++){var i=this.out_act.get_grad(e,m,j);h.add_grad(this.switchx[g],this.switchy[g],j,i);g++}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.sx=this.sx;d.sy=this.sy;d.stride=this.stride;d.in_depth=this.in_depth;d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;d.pad=this.pad;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type;this.sx=d.sx;this.sy=d.sy;this.stride=d.stride;this.in_depth=d.in_depth;this.pad=typeof d.pad!=="undefined"?d.pad:0;this.switchx=c.zeros(this.out_sx*this.out_sy*this.out_depth);this.switchy=c.zeros(this.out_sx*this.out_sy*this.out_depth)}};c.PoolLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.out_sx=typeof d.out_sx!=="undefined"?d.out_sx:d.in_sx;this.out_sy=typeof d.out_sy!=="undefined"?d.out_sy:d.in_sy;this.out_depth=typeof d.out_depth!=="undefined"?d.out_depth:d.in_depth;this.layer_type="input"};b.prototype={forward:function(d,e){this.in_act=d;this.out_act=d;return this.out_act},backward:function(){},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type}};c.InputLayer=b})(convnetjs);(function(d){var a=d.Vol;var b=function(e){var e=e||{};this.num_inputs=e.in_sx*e.in_sy*e.in_depth;this.out_depth=this.num_inputs;this.out_sx=1;this.out_sy=1;this.layer_type="softmax"};b.prototype={forward:function(h,o){this.in_act=h;var f=new a(1,1,this.out_depth,0);var j=h.w;var k=h.w[0];for(var l=1;l<this.out_depth;l++){if(j[l]>k){k=j[l]}}var n=d.zeros(this.out_depth);var g=0;for(var l=0;l<this.out_depth;l++){var m=Math.exp(j[l]-k);g+=m;n[l]=m}for(var l=0;l<this.out_depth;l++){n[l]/=g;f.w[l]=n[l]}this.es=n;this.out_act=f;return this.out_act},backward:function(j){var e=this.in_act;e.dw=d.zeros(e.w.length);for(var g=0;g<this.out_depth;g++){var f=g===j?1:0;var h=-(f-this.es[g]);e.dw[g]=h}return -Math.log(this.es[j])},getParamsAndGrads:function(){return[]},toJSON:function(){var e={};e.out_depth=this.out_depth;e.out_sx=this.out_sx;e.out_sy=this.out_sy;e.layer_type=this.layer_type;e.num_inputs=this.num_inputs;return e},fromJSON:function(e){this.out_depth=e.out_depth;this.out_sx=e.out_sx;this.out_sy=e.out_sy;this.layer_type=e.layer_type;this.num_inputs=e.num_inputs}};var c=function(e){var e=e||{};this.num_inputs=e.in_sx*e.in_sy*e.in_depth;this.out_depth=this.num_inputs;this.out_sx=1;this.out_sy=1;this.layer_type="regression"};c.prototype={forward:function(e,f){this.in_act=e;this.out_act=e;return e},backward:function(k){var e=this.in_act;e.dw=d.zeros(e.w.length);var j=0;if(k instanceof Array||k instanceof Float64Array){for(var h=0;h<this.out_depth;h++){var f=e.w[h]-k[h];e.dw[h]=f;j+=2*f*f}}else{var h=k.dim;var g=k.val;var f=e.w[h]-g;e.dw[h]=f;j+=2*f*f}return j},getParamsAndGrads:function(){return[]},toJSON:function(){var e={};e.out_depth=this.out_depth;e.out_sx=this.out_sx;e.out_sy=this.out_sy;e.layer_type=this.layer_type;e.num_inputs=this.num_inputs;return e},fromJSON:function(e){this.out_depth=e.out_depth;this.out_sx=e.out_sx;this.out_sy=e.out_sy;this.layer_type=e.layer_type;this.num_inputs=e.num_inputs}};d.RegressionLayer=c;d.SoftmaxLayer=b})(convnetjs);(function(b){var a=b.Vol;var c=function(f){var f=f||{};this.out_sx=f.in_sx;this.out_sy=f.in_sy;this.out_depth=f.in_depth;this.layer_type="relu"};c.prototype={forward:function(g,j){this.in_act=g;var f=g.clone();var k=g.w.length;var l=f.w;for(var h=0;h<k;h++){if(l[h]<0){l[h]=0}}this.out_act=f;return this.out_act},backward:function(){var g=this.in_act;var f=this.out_act;var j=g.w.length;g.dw=b.zeros(j);for(var h=0;h<j;h++){if(f.w[h]<=0){g.dw[h]=0}else{g.dw[h]=f.dw[h]}}},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type}};var e=function(f){var f=f||{};this.out_sx=f.in_sx;this.out_sy=f.in_sy;this.out_depth=f.in_depth;this.layer_type="sigmoid"};e.prototype={forward:function(g,k){this.in_act=g;var f=g.cloneAndZero();var l=g.w.length;var m=f.w;var j=g.w;for(var h=0;h<l;h++){m[h]=1/(1+Math.exp(-j[h]))}this.out_act=f;return this.out_act},backward:function(){var g=this.in_act;var f=this.out_act;var k=g.w.length;g.dw=b.zeros(k);for(var h=0;h<k;h++){var j=f.w[h];g.dw[h]=j*(1-j)*f.dw[h]}},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type}};var d=function(f){var f=f||{};this.group_size=typeof f.group_size!=="undefined"?f.group_size:2;this.out_sx=f.in_sx;this.out_sy=f.in_sy;this.out_depth=Math.floor(f.in_depth/this.group_size);this.layer_type="maxout";this.switches=b.zeros(this.out_sx*this.out_sy*this.out_depth)};d.prototype={forward:function(h,u){this.in_act=h;var o=this.out_depth;var t=new a(this.out_sx,this.out_sy,this.out_depth,0);if(this.out_sx===1&&this.out_sy===1){for(var m=0;m<o;m++){var k=m*this.group_size;var s=h.w[k];var p=0;for(var l=1;l<this.group_size;l++){var f=h.w[k+l];if(f>s){s=f;p=l}}t.w[m]=s;this.switches[m]=k+p}}else{var g=0;for(var r=0;r<h.sx;r++){for(var q=0;q<h.sy;q++){for(var m=0;m<o;m++){var k=m*this.group_size;var s=h.get(r,q,k);var p=0;for(var l=1;l<this.group_size;l++){var f=h.get(r,q,k+l);if(f>s){s=f;p=l}}t.set(r,q,m,s);this.switches[g]=k+p;g++}}}}this.out_act=t;return this.out_act},backward:function(){var h=this.in_act;var g=this.out_act;var l=this.out_depth;h.dw=b.zeros(h.w.length);if(this.out_sx===1&&this.out_sy===1){for(var j=0;j<l;j++){var k=g.dw[j];h.dw[this.switches[j]]=k}}else{var o=0;for(var f=0;f<g.sx;f++){for(var m=0;m<g.sy;m++){for(var j=0;j<l;j++){var k=g.get_grad(f,m,j);h.set_grad(f,m,this.switches[o],k);o++}}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.group_size=this.group_size;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type;this.group_size=f.group_size;this.switches=b.zeros(this.group_size)}};b.MaxoutLayer=d;b.ReluLayer=c;b.SigmoidLayer=e})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.out_sx=d.in_sx;this.out_sy=d.in_sy;this.out_depth=d.in_depth;this.layer_type="dropout";this.drop_prob=typeof d.drop_prob!=="undefined"?d.drop_prob:0.5;this.dropped=c.zeros(this.out_sx*this.out_sy*this.out_depth)};b.prototype={forward:function(e,g){this.in_act=e;if(typeof(g)==="undefined"){g=false}var d=e.clone();var h=e.w.length;if(g){for(var f=0;f<h;f++){if(Math.random()<this.drop_prob){d.w[f]=0;this.dropped[f]=true}else{this.dropped[f]=false}}}else{for(var f=0;f<h;f++){d.w[f]*=this.drop_prob}}this.out_act=d;return this.out_act},backward:function(){var d=this.in_act;var f=this.out_act;var g=d.w.length;d.dw=c.zeros(g);for(var e=0;e<g;e++){if(!(this.dropped[e])){d.dw[e]=f.dw[e]}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;d.drop_prob=this.drop_prob;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type;this.drop_prob=d.drop_prob}};c.DropoutLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.k=d.k;this.n=d.n;this.alpha=d.alpha;this.beta=d.beta;this.out_sx=d.in_sx;this.out_sy=d.in_sy;this.out_depth=d.in_depth;this.layer_type="lrn";if(this.n%2===0){console.log("WARNING n should be odd for LRN layer")}};b.prototype={forward:function(f,p){this.in_act=f;var e=f.cloneAndZero();this.S_cache_=f.cloneAndZero();var k=Math.floor(this.n/2);for(var n=0;n<f.sx;n++){for(var m=0;m<f.sy;m++){for(var h=0;h<f.depth;h++){var l=f.get(n,m,h);var o=0;for(var g=Math.max(0,h-k);g<=Math.min(h+k,f.depth-1);g++){var d=f.get(n,m,g);o+=d*d}o*=this.alpha/this.n;o+=this.k;this.S_cache_.set(n,m,h,o);o=Math.pow(o,this.beta);e.set(n,m,h,l/o)}}}this.out_act=e;return this.out_act},backward:function(){var f=this.in_act;f.dw=c.zeros(f.w.length);var d=this.out_act;var n=Math.floor(this.n/2);for(var r=0;r<f.sx;r++){for(var q=0;q<f.sy;q++){for(var l=0;l<f.depth;l++){var p=this.out_act.get_grad(r,q,l);var k=this.S_cache_.get(r,q,l);var e=Math.pow(k,this.beta);var s=e*e;for(var h=Math.max(0,l-n);h<=Math.min(l+n,f.depth-1);h++){var o=f.get(r,q,h);var m=-o*this.beta*Math.pow(k,this.beta-1)*this.alpha/this.n*2*o;if(h===l){m+=e}m/=s;m*=p;f.add_grad(r,q,h,m)}}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.k=this.k;d.n=this.n;d.alpha=this.alpha;d.beta=this.beta;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.out_depth=this.out_depth;d.layer_type=this.layer_type;return d},fromJSON:function(d){this.k=d.k;this.n=d.n;this.alpha=d.alpha;this.beta=d.beta;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.out_depth=d.out_depth;this.layer_type=d.layer_type}};c.LocalResponseNormalizationLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.out_sx=d.in_sx;this.out_sy=d.in_sy;this.out_depth=d.in_depth+d.in_depth*d.in_depth;this.layer_type="quadtransform"};b.prototype={forward:function(d,n){this.in_act=d;var j=this.out_depth;var e=d.depth;var m=new a(this.out_sx,this.out_sy,this.out_depth,0);for(var l=0;l<d.sx;l++){for(var k=0;k<d.sy;k++){for(var h=0;h<j;h++){if(h<e){m.set(l,k,h,d.get(l,k,h))}else{var g=Math.floor((h-e)/e);var f=(h-e)-g*e;m.set(l,k,h,d.get(l,k,g)*d.get(l,k,f))}}}}this.out_act=m;return this.out_act},backward:function(){var d=this.in_act;d.dw=c.zeros(d.w.length);var n=this.out_act;var j=this.out_depth;var e=d.depth;for(var m=0;m<d.sx;m++){for(var l=0;l<d.sy;l++){for(var h=0;h<j;h++){var k=n.get_grad(m,l,h);if(h<e){d.add_grad(m,l,h,k)}else{var g=Math.floor((h-e)/e);var f=(h-e)-g*e;d.add_grad(m,l,g,d.get(m,l,f)*k);d.add_grad(m,l,f,d.get(m,l,g)*k)}}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type}};c.QuadTransformLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){this.layers=[]};b.prototype={makeLayers:function(d){if(d.length<2){console.log("ERROR! For now at least have input and softmax layers.")}if(d[0].type!=="input"){console.log("ERROR! For now first layer should be input.")}var e=function(){var l=[];for(var k=0;k<d.length;k++){var m=d[k];if(m.type==="softmax"){l.push({type:"fc",num_neurons:m.num_classes})}if(m.type==="regression"){l.push({type:"fc",num_neurons:m.num_neurons})}if((m.type==="fc"||m.type==="conv")&&typeof(m.bias_pref)==="undefined"){m.bias_pref=0;if(typeof m.activation!=="undefined"&&m.activation==="relu"){m.bias_pref=0.1}}if(typeof m.tensor!=="undefined"){if(m.tensor){l.push({type:"quadtransform"})}}l.push(m);if(typeof m.activation!=="undefined"){if(m.activation==="relu"){l.push({type:"relu"})}else{if(m.activation==="sigmoid"){l.push({type:"sigmoid"})}else{if(m.activation==="maxout"){var j=m.group_size!=="undefined"?m.group_size:2;l.push({type:"maxout",group_size:j})}else{console.log("ERROR unsupported activation "+m.activation)}}}}if(typeof m.drop_prob!=="undefined"&&m.type!=="dropout"){l.push({type:"dropout",drop_prob:m.drop_prob})}}return l};d=e(d);this.layers=[];for(var f=0;f<d.length;f++){var h=d[f];if(f>0){var g=this.layers[f-1];h.in_sx=g.out_sx;h.in_sy=g.out_sy;h.in_depth=g.out_depth}switch(h.type){case"fc":this.layers.push(new c.FullyConnLayer(h));break;case"lrn":this.layers.push(new c.LocalResponseNormalizationLayer(h));break;case"dropout":this.layers.push(new c.DropoutLayer(h));break;case"input":this.layers.push(new c.InputLayer(h));break;case"softmax":this.layers.push(new c.SoftmaxLayer(h));break;case"regression":this.layers.push(new c.RegressionLayer(h));break;case"conv":this.layers.push(new c.ConvLayer(h));break;case"pool":this.layers.push(new c.PoolLayer(h));break;case"relu":this.layers.push(new c.ReluLayer(h));break;case"sigmoid":this.layers.push(new c.SigmoidLayer(h));break;case"maxout":this.layers.push(new c.MaxoutLayer(h));break;case"quadtransform":this.layers.push(new c.QuadTransformLayer(h));break;default:console.log("ERROR: UNRECOGNIZED LAYER TYPE!")}}},forward:function(e,g){if(typeof(g)==="undefined"){g=false}var d=this.layers[0].forward(e,g);for(var f=1;f<this.layers.length;f++){d=this.layers[f].forward(d,g)}return d},backward:function(g){var f=this.layers.length;var e=this.layers[f-1].backward(g);for(var d=f-2;d>=0;d--){this.layers[d].backward()}return e},getParamsAndGrads:function(){var d=[];for(var f=0;f<this.layers.length;f++){var g=this.layers[f].getParamsAndGrads();for(var e=0;e<g.length;e++){d.push(g[e])}}return d},getPrediction:function(){var g=this.layers[this.layers.length-1];var h=g.out_act.w;var d=h[0];var e=0;for(var f=1;f<h.length;f++){if(h[f]>d){d=h[f];e=f}}return e},toJSON:function(){var e={};e.layers=[];for(var d=0;d<this.layers.length;d++){e.layers.push(this.layers[d].toJSON())}return e},fromJSON:function(h){this.layers=[];for(var g=0;g<h.layers.length;g++){var e=h.layers[g];var f=e.layer_type;var d;if(f==="input"){d=new c.InputLayer()}if(f==="relu"){d=new c.ReluLayer()}if(f==="sigmoid"){d=new c.SigmoidLayer()}if(f==="dropout"){d=new c.DropoutLayer()}if(f==="conv"){d=new c.ConvLayer()}if(f==="pool"){d=new c.PoolLayer()}if(f==="lrn"){d=new c.LocalResponseNormalizationLayer()}if(f==="softmax"){d=new c.SoftmaxLayer()}if(f==="regression"){d=new c.RegressionLayer()}if(f==="fc"){d=new c.FullyConnLayer()}if(f==="maxout"){d=new c.MaxoutLayer()}if(f==="quadtransform"){d=new c.QuadTransformLayer()}d.fromJSON(e);this.layers.push(d)}}};c.Net=b})(convnetjs);(function(b){var a=b.Vol;var c=function(e,d){this.net=e;var d=d||{};this.learning_rate=typeof d.learning_rate!=="undefined"?d.learning_rate:0.01;this.l1_decay=typeof d.l1_decay!=="undefined"?d.l1_decay:0;this.l2_decay=typeof d.l2_decay!=="undefined"?d.l2_decay:0;this.batch_size=typeof d.batch_size!=="undefined"?d.batch_size:1;this.method=typeof d.method!=="undefined"?d.method:"sgd";this.momentum=typeof d.momentum!=="undefined"?d.momentum:0.9;this.ro=typeof d.ro!=="undefined"?d.ro:0.95;this.eps=typeof d.eps!=="undefined"?d.eps:0.000001;this.k=0;this.gsum=[];this.xsum=[]};c.prototype={train:function(s,r){var h=new Date().getTime();this.net.forward(s,true);var f=new Date().getTime();var q=f-h;var h=new Date().getTime();var A=this.net.backward(r);var k=0;var d=0;var f=new Date().getTime();var G=f-h;this.k++;if(this.k%this.batch_size===0){var e=this.net.getParamsAndGrads();if(this.gsum.length===0&&(this.method!=="sgd"||this.momentum>0)){for(var E=0;E<e.length;E++){this.gsum.push(b.zeros(e[E].params.length));if(this.method==="adadelta"){this.xsum.push(b.zeros(e[E].params.length))}else{this.xsum.push([])}}}for(var E=0;E<e.length;E++){var H=e[E];var w=H.params;var F=H.grads;var z=typeof H.l2_decay_mul!=="undefined"?H.l2_decay_mul:1;var I=typeof H.l1_decay_mul!=="undefined"?H.l1_decay_mul:1;var l=this.l2_decay*z;var n=this.l1_decay*I;var u=w.length;for(var B=0;B<u;B++){k+=l*w[B]*w[B]/2;d+=n*Math.abs(w[B]);var D=n*(w[B]>0?1:-1);var o=l*(w[B]);var t=(o+D+F[B])/this.batch_size;var m=this.gsum[E];var C=this.xsum[E];if(this.method==="adagrad"){m[B]=m[B]+t*t;var v=-this.learning_rate/Math.sqrt(m[B]+this.eps)*t;w[B]+=v}else{if(this.method==="windowgrad"){m[B]=this.ro*m[B]+(1-this.ro)*t*t;var v=-this.learning_rate/Math.sqrt(m[B]+this.eps)*t;w[B]+=v}else{if(this.method==="adadelta"){m[B]=this.ro*m[B]+(1-this.ro)*t*t;var v=-this.learning_rate*Math.sqrt((C[B]+this.eps)/(m[B]+this.eps))*t;C[B]=this.ro*C[B]+(1-this.ro)*v*v;w[B]+=v}else{if(this.momentum>0){var v=this.momentum*m[B]-this.learning_rate*t;m[B]=v;w[B]+=v}else{w[B]+=-this.learning_rate*t}}}}F[B]=0}}}return{fwd_time:q,bwd_time:G,l2_decay_loss:k,l1_decay_loss:d,cost_loss:A,softmax_loss:A,loss:A+d+k}}};b.Trainer=c;b.SGDTrainer=c})(convnetjs);(function(a){if(typeof module==="undefined"||typeof module.exports==="undefined"){window.jsfeat=a}else{module.exports=a}})(convnetjs);