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
  // },

  beginEditing: function() {
    if (this.get('isEditing')) return YES ;
    //if (!this.get('contentIsEditable')) return NO ;
    return this._beginEditing(YES);
  },
  
  _beginEditing: function(scrollIfNeeded) {
    var content  = this.get('content'),
        del      = this.get('displayDelegate'),
        labelKey = this.getDelegateProperty('contentValueKey', del),
        parent   = this.get('parentView'),
        pf       = parent ? parent.get('frame') : null,
        el       = this.$label(),
        f, v, offset, oldLineHeight, fontSize, top, lineHeight, 
        lineHeightShift, targetLineHeight, ret ;

    // if possible, find a nearby scroll view and scroll into view.
    // HACK: if we scrolled, then wait for a loop and get the item view again
    // and begin editing.  Right now collection view will regenerate the item
    // view too often.
    if (scrollIfNeeded && this.scrollToVisible()) {
      var collectionView = this.get('owner'), idx = this.get('contentIndex');
      this.invokeLast(function() {
        var item = collectionView.itemViewForContentIndex(idx);
        if (item && item._beginEditing) item._beginEditing(NO);
      });
      return YES; // let the scroll happen then begin editing...
    }
    
    // nothing to do...    
    if (!parent || !el || el.get('length')===0) return NO ;
    v = (labelKey && content && content.get) ? content.get(labelKey) : null ;


    f = this.computeFrameWithParentFrame(null);
    offset = SC.viewportOffset(el[0]);

    // if the label has a large line height, try to adjust it to something
    // more reasonable so that it looks right when we show the popup editor.
    oldLineHeight = el.css('lineHeight');
    fontSize = el.css('fontSize');
    top = this.$().css('top');

    if (top) top = parseInt(top.substring(0,top.length-2),0);
    else top =0;

    lineHeight = oldLineHeight;
    lineHeightShift = 0;

    if (fontSize && lineHeight) {
      targetLineHeight = fontSize * 1.5 ;
      if (targetLineHeight < lineHeight) {
        el.css({ lineHeight: '1.5' });
        lineHeightShift = (lineHeight - targetLineHeight) / 2; 
      } else oldLineHeight = null ;
    }

    f.x = offset.x;
    f.y = offset.y+top + lineHeightShift ;
    f.height = el[0].offsetHeight ;
    f.width = el[0].offsetWidth ;

    ret = Fotofoo.InlineTextFieldView.beginEditing({
      frame: f, 
      exampleElement: el, 
      delegate: this, 
      value: v,
      multiline: NO,
      isCollection: YES,
      validator: Fotofoo.FileNameValidator
    }) ;

    // restore old line height for original item if the old line height 
    // was saved.
    if (oldLineHeight) el.css({ lineHeight: oldLineHeight }) ;

    // Done!  If this failed, then set editing back to no.
    return ret ;
  }

});
