// ==========================================================================
// Project:   Fotofoo.ThumbnailView
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Fotofoo.ThumbnailView = SC.View.extend(
/** @scope Fotofoo.ThumbnailView.prototype */ {

  childViews: 'imageView nameLabel'.w(),

  imageView: SC.ImageView.design({
    classNames: ['thumbnail'],
    layout: {
      top: 10, left: 10, right: 5, bottom: 5, centerX: 0,
      width: Fotofoo.MAX_THUMBNAIL_SIZE
    },

    valueBinding: '.parentView*content.url',

    isVisible: function() {
      return this.get('status') === SC.IMAGE_STATE_LOADED;
    }.property('status'),

    didCreateLayer: function() {
      var view = this;
      var $this = this.$();
      SC.Event.add($this.get(0), 'load', this, function() {
        var width = $this.width(),
            height = $this.height();
        if (width && height) {
          if (width > height) {
            if (width > Fotofoo.MAX_THUMBNAIL_SIZE) {
              height = Math.floor(height * Fotofoo.MAX_THUMBNAIL_SIZE / width);
              width = Fotofoo.MAX_THUMBNAIL_SIZE;
            }
          } else {
            if (height > Fotofoo.MAX_THUMBNAIL_SIZE) {
              width = Math.floor(width * Fotofoo.MAX_THUMBNAIL_SIZE / height);
              height = Fotofoo.MAX_THUMBNAIL_SIZE;
            }
          }
          SC.RunLoop.begin();
          view.adjust({ width: width });
          var nameLabel = view.getPath('parentView.nameLabel');
          nameLabel.adjust({ top: height + 20 });
          SC.RunLoop.end();
        }
        return YES;
      });

      return sc_super();
    },

    mouseDown: function(evt) {
      if (evt && evt.which === 1 && evt.clickCount > 1) {
        this.invokeLater(function(){
          Fotofoo.set('state', 'PREVIEW');
        });
      } else if (evt && evt.which === 3 || (evt.ctrlKey && evt.which == 1)) { // right-click
        var contextMenu = SCUI.ContextMenuPane.create({
          items: [{
            title: '_Cut'.loc(),
            isEnabled: YES,
            shortCut: 'ctrl_x',
            keyEquivalent: 'ctrl_x',
            action: 'cutFile',
            target: 'Fotofoo.LIBRARY'
          }, {
            title: '', isEnabled: YES, separator: YES
          }, {
            title: '_Edit'.loc(),
            isEnabled: YES,
            action: 'previewFile',
            target: 'Fotofoo.LIBRARY'
          }],
          isEnabled: YES,
          itemIsEnabledKey: "isEnabled",
          itemTitleKey: "title",
          itemIconKey: "icon",
          itemSeparatorKey: 'separator',
          itemActionKey: 'action',
          itemCheckboxKey: 'checkbox',
          itemBranchKey: 'branchItem',
          preferType: SC.PICKER_MENU,
          subMenuKey: 'subMenu',
          itemShortCutKey: 'shortCut',
          layout: { width: 150 },
          itemKeyEquivalentKey: 'keyEquivalent',
          itemHeightKey: 'height',
          contentView: SC.View.extend({
            layout: { width: 150, height: 200 }
          })
        });
        contextMenu.popup(this, evt);
        evt.rightClickHandled = YES;
      }

      // HACK: this method (mouseDown) needs to return YES for
      // mouseDragged to be called, however, if the grandparent view,
      // e.g. the grid view, wants to know that one of it's children was
      // clicked then returning YES would never pass it down the chain.
      // Therefore, we need to pass it down here and then return.
      var grandParentView = this.getPath('parentView.parentView');
      if (grandParentView && grandParentView.mouseDown) {
        grandParentView.mouseDown.apply(grandParentView, arguments);
      }

      var selected = SC.$('.workspace .selected');
      selected.removeClass('selected').view().forEach(function(view){
        view.adjust({ top: 10, left: 10 });
      });
      this.adjust({ top: 5, left: 5 });
      this.$().addClass('selected');
      return sc_super();
    },

    mouseDragged: function(evt) {
      SC.Drag.start({
        event: evt,
        source: this,
        dragView: SC.clone(this),
        ghost: YES,
        ghostActsLikeCursor: YES,
        slideBack: YES,
        dataSource: this.getPath('parentView*content')
      });
      return sc_super();
    }
  }),

  nameLabel: Fotofoo.FileName.design({
    layout: { left: 14, height: 18, width: Fotofoo.MAX_THUMBNAIL_SIZE },
    textAlign: SC.ALIGN_CENTER,
    contentBinding: '.parentView.content',
    valueBinding: '.parentView*content.description'
  })

});
