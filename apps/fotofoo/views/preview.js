// ==========================================================================
// Project:   Fotofoo.Preview
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Fotofoo.Preview = SC.View.extend(
/** @scope Fotofoo.Preview.prototype */ {

  childViews: ['imageView'],

  content: null,
  contentBinding: 'Fotofoo.fileController.content',

  dimensionsDidChange: function() {
    var content = this.get('content');
    if (content) {
      var imageView = this.get('imageView');
      imageView.adjust({
        width: content.get('width'),
        height: content.get('height')
      }).updateLayout();
    }
  }.observes('*content.width', '*content.height'),

  imageView: SC.ImageView.design({
    valueBinding: '.parentView*content.url',
    layout: {
      width: Fotofoo.MAX_THUMBNAIL_SIZE,
      height: Fotofoo.MAX_THUMBNAIL_SIZE,
      centerX: 0, centerY: -32
    }
  })

});
