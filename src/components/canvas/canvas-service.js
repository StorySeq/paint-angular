'use strict';

angular.module('paintAngular')
.service('canvasService', [
  function() {
    var _canvasLayers = null,
        _listeners = {},
        _imageStretch = false,
        _width = null,
        _height = null,
        _parentEl = null;

    function fire(event, params) {
      var listeners = _listeners[event];
      if (!listeners) { return; }

      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, params);
      }
    }

    function getImage (canvasLayer, withBg) {
      var canvasSave = document.createElement('canvas'),
      ctxSave = canvasSave.getContext('2d');

      withBg = withBg === false ? false : true;

      $(canvasSave)
      .css({display: 'none', position: 'absolute', left: 0, top: 0})
      .attr('width', _width)
      .attr('height', _height);


      if (withBg) { ctxSave.drawImage(_canvasLayers.bg.el, 0, 0); }
      ctxSave.drawImage(canvasLayer.el, 0, 0);

      return canvasSave.toDataURL();
    }

    function setImage (canvasLayer, img, resize) {
      if (!img) { return; }

      var myImage = null,
      ctx = '';

      function loadImage() {
        var ratio = 1, xR = 0, yR = 0, x = 0, y = 0, w = myImage.width, h = myImage.height;

        if (!resize) {
          // get width/height
          if (myImage.width > _width || myImage.height > _height || _imageStretch) {
            xR = _width / myImage.width;
            yR = _height / myImage.height;

            ratio = xR < yR ? xR : yR;

            w = myImage.width * ratio;
            h = myImage.height * ratio;
          }

          // get left/top (centering)
          x = (_width - w) / 2;
          y = (_height - h) / 2;
        }

        ctx.clearRect(0, 0, _width, _height);
        ctx.drawImage(myImage, x, y, w, h);

        // wtf?
        // _this[ctxType + 'Resize'] = false;
      }

      ctx = canvasLayer.ctx;

      if (window.rgbHex(img)) {
        ctx.clearRect(0, 0, _width, _height);
        ctx.fillStyle = img;
        ctx.rect(0, 0, _width, _height);
        ctx.fill();
      }
      else {
        myImage = new Image();
        myImage.src = img.toString();
        $(myImage).load(loadImage);
      }
    }

    return {
      init: function(canvasLayers, width, height) {
        _canvasLayers = canvasLayers;
        _width = width;
        _height = height;
        _parentEl = _canvasLayers.canvas.$.parent();
        fire('initialized');
      },

      isInitialized: function() {
        return _canvasLayers !== null;
      },

      getImage: function() {
        return getImage(_canvasLayers.canvas);
      },

      getBgImage: function() {
        return getImage(_canvasLayers.bg);
      },

      setImage: function(image) {
        setImage(_canvasLayers.canvas, image);
      },

      setBgImage: function(image) {
        setImage(_canvasLayers.bg, image);
      },

      resize: function () {
        var bg = this.getBgImage(),
            image = this.getImage();

        _width = _parentEl.width();
        _height = _parentEl.height();

        _canvasLayers.bg.el.width = _width;
        _canvasLayers.bg.el.height = _height;
        _canvasLayers.canvas.el.width = _width;
        _canvasLayers.canvas.el.height = _height;

        setImage(_canvasLayers.bg, bg, true);
        setImage(_canvasLayers.image, image, true);
      }
    };
  }
]);
