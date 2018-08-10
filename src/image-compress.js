(function (window, undefined) {

    var image, reader;

    var CompressImage = function (conf) {
        this.config = {
            width: 0,
            height: 0,
            ratio: 0.5,
        };
        this.file = null;
        this.canvas = document.createElement('canvas'),
        this.context = this.canvas.getContext("2d");

        this.dataURL = '';
        return this.init(conf);
    };

    CompressImage.prototype.init = function (conf) {
        if (conf.width) {
            this.config.width = conf.width;
        }
        if (conf.height) {
            this.config.height = conf.height;
        }
        if (conf.ratio) {
            this.config.ratio = conf.ratio;
        }

        image = new Image();
        reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
        };
        var _this = this;
        image.onload = function (e) {
            var ratio = 0, config = _this.config;
            if (config.width) {
                ratio = config.width / this.width;
            } else if (config.height) {
                ratio = config.height / this.height;
            }
            if (ratio == 0) {
                ratio = config.ratio;
            }

            _this.canvas.width = ratio * this.width;
            _this.canvas.height = ratio * this.height;

            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.context.drawImage(this, 0, 0, _this.canvas.width, _this.canvas.height);

            if (typeof _this.getDataURL === 'function') {
                _this.getDataURL.call(this, _this.canvas.toDataURL());
            }
            if (typeof _this.getBlob === 'function') {
                _this.canvas.toBlob(_this.getBlob);
            }
        }
        return this;
    };
    
    /**
     * 运行
     * @param File file 文件对象
     */
    CompressImage.prototype.run = function (file) {
        if (file && file.type.indexOf('image') == 0) {
            this.file = file;
        } else {
            console.error('not a image file');
            return ;
        }
        reader.readAsDataURL(this.file);
        return this;
    };

    /**
     *  订阅回调
     * @param string event 事件名： "dataUrl" || "blob"
     * @param function callback 处理函数
     */
    CompressImage.prototype.on = function (event, callback) {
        if (typeof callback != 'function') {
            console.error('param #2 must be callback');
            return ;
        }
        switch (event) {
            case 'dataUrl':
                this.getDataURL = callback;
                break;
            case 'blob':
                this.getBlob = callback;
                break;
            default:
                console.error('not supported event name');
                return ;
        }
        return this;
    }

    window.CompressImage = CompressImage;
} (window));