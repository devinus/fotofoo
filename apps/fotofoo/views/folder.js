// ==========================================================================
// Project:   Fotofoo.FolderView
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

require('views/inline_text_field');
require('validators/file_name');

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Fotofoo.FolderView = SC.ListItemView.extend(
  // SC.DropTarget,
  Fotofoo.CommitAfterEditing,
/** @scope Fotofoo.FolderView.prototype */ {

  validator: Fotofoo.FileNameValidator,

  // Implements SC.DropTarget protocol
  isDropTarget: true,
  dragStarted: function(drag, evt) {},
  dragEntered: function() { this.$().addClass('drop-potential'); },
  dragUpdated: function(drag, evt) {},
  dragExited: function() { this.$().removeClass('drop-potential'); },
  dragEnded: function(drag, evt) {},
  computeDragOperations: function(drag) { return SC.DRAG_MOVE; },
  acceptDragOperation: function(drag, op) { return YES; },

  performDragOperation: function(drag, op) {
    var dataSource = drag.get('dataSource'),
        type = dataSource.get('type');

    if (type === 'File') {
      dataSource.set('folder', this.get('content'));
      dataSource.addObserver('status', dataSource, function() {
        var status = this.get('status');
        if (status && status & SC.Record.READY_CLEAN) {
          this.removeObserver('status', this, arguments.callee);
          this.get('folder').refresh();
        }
      });
      dataSource.commitRecord();
      return SC.DRAG_MOVE;
    } // else if (type === 'Folder') {
    //       try {
    //         dataSource.set('parentFolder', this.get('content'));
    //       } catch (e) {}
    //       dataSource.commitRecord();
    // 
    //       var parentView = this.get('parentView'),
    //           folderView = parentView.itemViewForContentObject(this.get('content')),
    //           idx = folderView.get('contentIndex'),
    //           set = (!SC.none(idx)) ? SC.IndexSet.create(idx) : null,
    //           del = folderView.get('displayDelegate');
    // 
    //       if (set && del && del.expand) del.expand(set);
    //       else folderView.set('disclosureState', SC.BRANCH_OPEN);
    //       folderView.displayDidChange();
    // 
    //       return SC.DRAG_MOVE;
    //     }
    return SC.DRAG_NONE;
  },

  mouseDown: function() {
    var state = Fotofoo.get('state');
    if (state !== 'LIBRARY') {
      Fotofoo.set('state', 'LIBRARY');
      return YES;
    }

    return sc_super();
    // var parentView = this.get('parentView');
    // if (parentView && parentView.mouseDown) {
    //   parentView.mouseDown.apply(parentView, arguments);
    // }
    // 
    // return sc_super() || YES;
  },

  // mouseDragged: function(evt) {
  //   SC.Drag.start({
  //     event: evt,
  //     source: this,
  //     dragView: SC.clone(this),
  //     ghost: YES,
  //     ghostActsLikeCursor: YES,
  //     slideBack: YES,
  //     dataSource: this.get('content')
  //   });
  //   return sc_super();
  // }

});
