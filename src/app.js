//
console.log('start app');
//
function foo(response) {
    console.log(new Collection(response.data));
}
//
document.getElementById('btn-tag').addEventListener('click', function() {
    var tmp = document.getElementById('tagList');
    if (tmp.style.display == 'none') {
        tmp.style.display = '';
    } else {
        tmp.style.display = 'none';
    }
});
//
function Collection(json) {
    var _this = this;
    this.data = json;
    //tags
    this.tagName = 'none';
    var tmp = ['none'];
    json.forEach(function(e) {
        if (e.name.indexOf('@') != -1) {
            var tags = e.name.split('@')[1].split('.')[0];
            if (tags) {
                e.tags = tags.split('&');
                //http://qiita.com/takeharu/items/d75f96f81ff83680013f
                Array.prototype.push.apply(tmp, e.tags);
            }
        }
    });
    //http://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
    this.tags = tmp.filter(function(x, i, self) {
        return self.indexOf(x) === i;
    });
    //
    this.tags.forEach(function(e) {
        var li = document.createElement('li');
        li.innerHTML = e;
        if (e == 'none') {
            li.classList.add('on');
        }
        li.addEventListener('click', function() {
            var tags = this.parentNode.getElementsByClassName('on')[0];
            tags.classList.remove('on');
            this.classList.add('on');
            _this.tagName = this.innerHTML;
            _this.refresh();
        });
        document.getElementById('tagList').appendChild(li);
    });
    //
    function* generator(){
        yield* _this.data;
    }
    this.g = generator();
    //
    var svgContainer = document.getElementById('svgContainer');
    svgContainer.addEventListener('click', function() {
        zoom.hide();
    });
    //
    more.$more().addEventListener('click', function() {
        more.reset();
        more.hide();
        _this.loadItem();
    });
    //
    this.loadItem();
}
//
Collection.prototype.loadItem = function() {
    if (more.enable && !more.next()) {
        more.show();
        return;
    }
    //
    var data = this.g.next();
    if (data.done) {
        more.hide();
        return;
    }
    //
    var _this = this;
    var img = document.createElement('img');
    img.onload = function() {
        var li = document.createElement('li');
        li.addEventListener('click', function() {
            _this.createZoom(this, data.value);
        });
        li.appendChild(img);
        document.getElementById('main').insertBefore(li, document.getElementById('more'));
        //tag filter
        var tmp = data.value.tags;
        if (_this.tagName != 'none' && (!Array.isArray(tmp) || tmp.indexOf(_this.tagName) == -1)) {
            li.style.display = 'none';
        }
        //
        _this.loadItem();
    }
    img.src = 'https://yusai.github.io/template-for-inkscape/' + data.value.path;
};
//
Collection.prototype.createZoom = function(target, data) {
    var img = target.children[0].cloneNode(true);
    var svgContainer = document.getElementById('svgContainer');
    //
    svgContainer.innerHTML = '';
    svgContainer.appendChild(img);
    //
    var tagsContainer = document.getElementById('tags');
    tagsContainer.innerHTML = '';
    var tags = data.tags;
    if (Array.isArray(tags)) {
        tags.forEach(function(tag) {
            var span = document.createElement('span');
            span.innerHTML = tag;
            tagsContainer.appendChild(span);
        });
    }
    //
    var download = document.getElementById('download');
    download.setAttribute('href', 'template/' + data.name);
    download.setAttribute('download', data.name);
    download.setAttribute('target', '_blank');
    //
    zoom.show();
};
//
Collection.prototype.refresh = function() {
    var parent = document.getElementById('main');
    var children = parent.children;
    for (var i = 0; i < children.length - 1; i++) {
        var tmp = this.data[i].tags;
        if (this.tagName == 'none' || Array.isArray(tmp) && tmp.indexOf(this.tagName) >= 0){
            children[i].style.display = '';
        } else {
            children[i].style.display = 'none';
        }
    }
};
//
var zoom = {
    container: function() {
        return document.getElementById('zoom');
    },
    h1: function() {
        return document.getElementsByTagName('h1')[0];
    },
    show: function() {
        this.container().style.display = '';
        this.h1().classList.add('zoom');
    },
    hide: function() {
        this.container().style.display = 'none';
        this.h1().classList.remove('zoom');
    }
};
//
var more = {
    index: 10,
    enable: false,
    next: function() {
        return --this.index >= 0;
    },
    reset: function() {
        this.index = 10;
    },
    $more: function() {
        return document.getElementById('more');
    },
    show: function() {
        this.$more().style.display = '';
    },
    hide: function() {
        this.$more().style.display = 'none';
    }
};
