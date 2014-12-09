'use strict';

angular.module('paintAngular')
.service('canvasService', [
  function() {
    var _canvasLayers = null,
        _listeners = {},
        _imageStretch = false,
        _dimensions = null,
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
      .attr('width', _dimensions.width)
      .attr('height', _dimensions.height);


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
          if (myImage.width > _dimensions.width || myImage.height > _dimensions.height || _imageStretch) {
            xR = _dimensions.width / myImage.width;
            yR = _dimensions.height / myImage.height;

            ratio = xR < yR ? xR : yR;

            w = myImage.width * ratio;
            h = myImage.height * ratio;
          }

          // get left/top (centering)
          x = (_dimensions.width - w) / 2;
          y = (_dimensions.height - h) / 2;
        }

        ctx.clearRect(0, 0, _dimensions.width, _dimensions.height);
        ctx.drawImage(myImage, x, y, w, h);
      }

      ctx = canvasLayer.ctx;

      if (window.rgbHex(img)) {
        ctx.clearRect(0, 0, _dimensions.width, _dimensions.height);
        ctx.fillStyle = img;
        ctx.rect(0, 0, _dimensions.width, _dimensions.height);
        ctx.fill();
      }
      else {
        myImage = new Image();
        myImage.src = img.toString();
        $(myImage).load(loadImage);
      }
    }

    /**
     * public api
     */
    return {
      init: function(canvasLayers, dimensions) {
        _canvasLayers = canvasLayers;
        _dimensions = dimensions;
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

      resize: function(width, height) {
        var bg = this.getBgImage(),
            image = this.getImage();

        _parentEl.width(width);
        _parentEl.height(height);
        _dimensions.width = width;
        _dimensions.height = height;

        _canvasLayers.bg.el.width = _dimensions.width;
        _canvasLayers.bg.el.height = _dimensions.height;
        _canvasLayers.canvas.el.width = _dimensions.width;
        _canvasLayers.canvas.el.height = _dimensions.height;

        setImage(_canvasLayers.bg, bg, true);
        setImage(_canvasLayers.canvas, image, true);
      }
    };
  }
]);
