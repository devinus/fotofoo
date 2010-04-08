// ==========================================================================
// Project:   Fotofoo.Library
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

require('views/thumbnail');

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Fotofoo.LibraryView = SC.ScrollView.extend(
/** @scope Fotofoo.Library.prototype */ {

  contentView: SC.GridView.extend({
    layout: { top: 50, left: 50, right: 50, bottom: 50, centerX: 0 },

    rowHeight: Fotofoo.MAX_THUMBNAIL_SIZE + 50,
    columnWidth: Fotofoo.MAX_THUMBNAIL_SIZE + 20,

    contentValueKey: 'name',
    exampleView: Fotofoo.ThumbnailView,

    contentBinding: 'Fotofoo.filesController',
    selectionBinding: 'Fotofoo.filesController.selection',

    selectOnMouseDown: YES,
    allowsMultipleSelection: NO,

    isVisible: NO,
    isVisibleBinding: 'Fotofoo.folderController.hasFiles',

    mouseDown: function(evt) {
      if (evt && (evt.which === 3 || (evt.ctrlKey && evt.which == 1)) && !evt.rightClickHandled) { // right-click
        if (!Fotofoo.foldersController.get('hasSelection')) return YES;

        var contextMenu = SCUI.ContextMenuPane.create({
          items: [{
            title: '_Paste'.loc(),
            isEnabled: function() {
              return !!Fotofoo.foldersController.get('clipboard');
            }.property('Fotofoo.foldersController.clipboard').cacheable(),
            shortCut: 'ctrl_v',
            keyEquivalent: 'ctrl_v',
            action: function() {
              var folder = Fotofoo.foldersController.getPath('selection.firstObject');
              var file = Fotofoo.foldersController.get('clipboard');
              Fotofoo.foldersController.set('clipboard', null);
              if (folder && file) {
                file.set('folder', folder);
                file.commitRecord();
              }
              return YES;
            }
          }],
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
        return YES;
      }

      return sc_super();
    }
  })

});
