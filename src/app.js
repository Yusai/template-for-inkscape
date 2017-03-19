//A = [B, B = A][0]; // Swap

(function() {
    console.log('start app');
    //
    var request = new XMLHttpRequest();
    request.open('get', 'src/list.json', true);
    request.onload = function(event) {
        var json = JSON.parse(request.responseText);
        //Shuffle
        for (var i = 0; i < json.length; i++) {
            json.push(json.splice(Math.floor(Math.random(json.length) * 10), 1)[0]);
        }
        //start
        console.log(new Collection(json));
    }
    //
    request.send(null);
})();
//
function Collection(json) {
    var _this = this;
    this.data = json;
    //
    function* generator(){
        yield* _this.data;
    }
    this.g = generator();
    //
    var svgContainer = document.getElementById('svgContainer');
    svgContainer.addEventListener('click', function() {
        _this.zoomHide();
    });
    //
    this.loadItem();
}
//
Collection.prototype.loadItem = function() {
    var data = this.g.next();
    if (data.done) {
        return;
    }
    //
    var _this = this;
    var file = 'template/' + data.value.file + '.svg';
    //
    var request = new XMLHttpRequest();
    request.open('get', file, true);
    request.onload = function() {
        var svg = this.responseText;
        //
        var li = document.createElement('li');
        li.innerHTML = svg;
        li.addEventListener('click', function() {
            _this.zoom(this, data.value);
        });
        //
        var svg = li.children[0];
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        //
        document.getElementById('main').appendChild(li);
        //
        _this.loadItem();
    };
    request.send(null);
};
//
Collection.prototype.zoom = function(target, data) {
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
    download.setAttribute('href', 'template/' + data.file + '.svg');
    download.setAttribute('download', data.file + '.svg');
    //
    this.zoomShow();
};
//
Collection.prototype.zoomShow = function() {
    //
    var main = document.getElementById('main');
    main.style.display = 'none';
    //
    var zoom = document.getElementById('zoom');
    zoom.style.display = '';
    //
    var h1 = document.getElementsByTagName('h1')[0];
    h1.classList.add('zoom');
};
//
Collection.prototype.zoomHide = function() {
    //
    var main = document.getElementById('main');
    main.style.display = '';
    //
    var zoom = document.getElementById('zoom');
    zoom.style.display = 'none';
    //
    var h1 = document.getElementsByTagName('h1')[0];
    h1.classList.remove('zoom');
};