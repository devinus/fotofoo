// ==========================================================================
// Project:   Fotofoo.foldersController
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Fotofoo.foldersController = SC.TreeController.create(
/** @scope Fotofoo.foldersController.prototype */ {

  treeItemIsGrouped: YES,

  newFolder: function() {
    var sel = this.getPath('selection.firstObject'),
        useSelectionAsParent = sel ? !sel.get('isTrash') : NO,
        root = this.getPath('content.treeItemChildren.firstObject'),
        parentFolder = useSelectionAsParent ? sel.get('guid') || '/' : '/',
        newFolder = Fotofoo.store.createRecord(Fotofoo.Folder, {
          type: 'Folder',
          guid: (parentFolder === '/' ? '' : parentFolder + '/') + SC.generateGuid(),
          parentFolder: parentFolder
        });

    var $this = this;
    newFolder.addObserver('status', newFolder, function() {
      var status = this.get('status');
      if (status && status & SC.Record.READY_CLEAN) {
        this.removeObserver('status', this, arguments.callee);

        try {
          if (useSelectionAsParent) sel.get('childFolders').pushObject(this);
          else Fotofoo.getPath('rootFolder.childFolders').pushObject(this);
        } catch (e) {}

        if (useSelectionAsParent) {
          var folderView = Fotofoo.foldersView.itemViewForContentObject(sel),
              idx = folderView.get('contentIndex'),
              set = (!SC.none(idx)) ? SC.IndexSet.create(idx) : null,
              del = folderView.get('displayDelegate');

          if (set && del && del.expand) del.expand(set);
          else folderView.set('disclosureState', SC.BRANCH_OPEN);
          folderView.displayDidChange();
        }

        $this.selectObject(this);
        Fotofoo.foldersView.itemViewForContentObject(this).beginEditing();
      }
    });

    newFolder.commitRecord();
    return YES;
  }

}) ;
