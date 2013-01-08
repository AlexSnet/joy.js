(function(J) {
  /**
   * Handles spritesheet animations
   * @class SpriteSheet
   * @constructor
   *
   * @param {Object} options
   *  @param {Object} animations
   */
  var SpriteSheet = J.Sprite.extend({
    init: function (options) {
      var self = this;
      this._super(options);

      this._animations = {length: 0};
      this._frequencyInterval = null;

      // Frames
      this.frames = 1;

      /**
       * @property currentFrame
       * @type {Number}
       */
      this.currentFrame = 0;

      /**
       * Frames per second.
       * @property framesPerSecond
       * @alias fps
       * @type {Number}
       */
      this.framesPerSecond = options.framesPerSecond || options.fps || 24;

      if (options.animations) {
        for (var name in options.animations) {
          if (options.animations[name] instanceof Array) {
            this.addAnimation(name, options.animations[name]);
          }
        }
      }

      /**
       * @property currentAnimation
       * @type {String}
       * @readonly
       */
      this._currentAnimation = null;
      this.__defineGetter__('currentAnimation', function () {
        return this._currentAnimation;
      });

      // framesPerSecond alias
      this.__defineGetter__('fps', function () {
        return this.framesPerSecond;
      });

      // Create the interval to change through frames
      this._frequencyInterval = setInterval(function(){ self._update(); }, 1000 / this.framesPerSecond);
    },

    _update: function() {
      var currentAnimation = this._animations[this._currentAnimation];

      if (this.currentFrame == currentAnimation.lastFrame) {
        this.trigger('animationEnd');
        this.currentFrame = currentAnimation.firstFrame;
      } else {
        this.currentFrame = this.currentFrame + 1;
      }
    },

    /**
     * Add animation to sprite sheet.
     * @param {String} name
     * @param {Array} frames
     *
     * @example
     *  spriteSheet.addAnimation("walking", [0, 32]);
     *
     * @return this
     */
    addAnimation: function (name, frames) {
      var firstFrame = frames[0], lastFrame = frames[1];
      this._animations[name] = {firstFrame: firstFrame, lastFrame: lastFrame};

      // Increase animations set length;
      this._animations.length = (this._animations.length || 0) + 1;

      return this;
    },

    onLoad: function () {
      this._super();
      var totalFrames = 1;

      // Check for spritesheet
      if (this._width < this.image.width) {
        totalFrames = this._columns = Math.ceil(this.image.width / this._width);
      }
      if (this._height < this.image.height) {
        totalFrames = totalFrames * (this._rows = Math.ceil(this.image.height / this._height));
      }

      if (this._animations.length === 0 || this._currentAnimation === null) {
        this.addAnimation('default', [0, totalFrames-1]);
        this.play('default');
      }
    },

    /**
     * Play specified animation by name
     * @param {String} animationName
     * @return this
     */
    play: function (animationName) {
      if (this._currentAnimation != animationName) {
        this._currentAnimation = animationName;
        this.currentFrame = this._animations[animationName].firstFrame;
      }
      return this;
    },

    render: function() {
      if (!this.visible) { return; }

      this.checkCollisions();

      this.ctx.drawImage(this.image,
                         this._width * (this.currentFrame % this._columns),
                         this._height * ((this.currentFrame / this._columns) >> 0),
                         this._width,
                         this._height,
                         0,
                         0,
                         this._width,
                         this._height);

      // Draw debugging rectangle around sprite
      if (J.debug) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(0, 0, this._width, this._height);
      }

    }
  });

  J.SpriteSheet = SpriteSheet;
})(Joy);