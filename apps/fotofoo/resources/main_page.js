// ==========================================================================
// Project:   Fotofoo - mainPage
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

require('views/folder');
require('views/library');
require('views/preview');

// This page describes the main user interface for your application.  
Fotofoo.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Fotofoo,

    childViews: 'splitView footer'.w(),

    splitView: SC.SplitView.design({
      layout: { bottom: 32 },
      dividerThickness: 1,
      defaultThickness: 300,
      topLeftMaxThickness: 300,

      topLeftView: SC.View.design({
        layout: { width: 300 },
        childViews: 'scrollView'.w(),

        scrollView: SC.ScrollView.design(SC.Border, {
          borderStyle: SC.BORDER_GRAY,
          hasHorizontalScroller: NO,

          contentView: SC.SourceListView.design({
            layout: { left: -16 },
            rowHeight: 24,
            hasContentIcon:  YES,
            canEditContent: YES,
            contentIconKey:  'icon',
            contentValueKey: 'name',
            contentUnreadCountKey: 'count',
            contentBinding: 'Fotofoo.foldersController.arrangedObjects',
            selectionBinding: 'Fotofoo.foldersController.selection',
            allowsMultipleSelection: NO,
            groupExampleView: SC.ListItemView.design({
              contentValueKey: 'name'
            }),
            exampleView: Fotofoo.FolderView,
            init: function() {
              Fotofoo.foldersView = this;
              return sc_super();
            }
          })
        })
      }),

      bottomRightView: SC.ContainerView.design({
        nowShowingBinding: 'Fotofoo.nowShowing'
      })
    }),

    footer: SC.ToolbarView.design({
      classNames: 'footer',
      childViews: 'leftView centerView'.w(),
      anchorLocation: SC.ANCHOR_BOTTOM,

      leftView: SC.View.design({
        childViews: 'buttons'.w(),

        buttons: SC.View.design({
          layout: { left: -16, top: 4, width: 100 },
          childViews: ['folderButtons'],

          folderButtons: SC.SegmentedView.design({
            itemTitleKey: 'title',
            itemActionKey: 'action',
            itemTargetKey: 'target',
            itemIsEnabledKey: 'isEnabled',
            items: [SC.Object.create({
              title: '\u271A',
              action: 'newFolder',
              isEnabled: YES
            }), SC.Object.create({
              title: '\u25AC',
              action: 'deleteFolder',
              isEnabled: NO,
              isEnabledBinding: 'MediaLibrary.folderController.hasContent'
            })]
          })
        })
      }),

      centerView: SC.View.design({
        childViews: ['fileButtons'],
        layout: { top: 4, left: 284, width: 100 },
        fileButtons: SC.SegmentedView.design({
          itemTitleKey: 'title',
          itemActionKey: 'action',
          itemTargetKey: 'target',
          itemIsEnabledKey: 'isEnabled',
          items: [SC.Object.create({
            title: '\u271A',
            action: 'uploadDialog',
            isEnabled: NO,
            isEnabledBinding: 'Fotofoo.foldersController.hasSelection'
          }), SC.Object.create({
            title: '\u25AC',
            action: 'deleteFile',
            isEnabled: NO,
            isEnabledBinding: 'Fotofoo.filesController.hasSelection'
          })]
        })
      })
    })
  }),

  library: SC.View.design({
    classNames: ['workspace'],
    childViews: 'usageTip emptyNotice gridView'.w(),
    usageTip: SC.View.design({
      childViews: ['labelView'],
      layout: { height: 32, centerY: 0 },
      labelView: SC.LabelView.design({
        classNames: ['usage-tip'],
        isVisibleBinding: SC.Binding.from('Fotofoo.foldersController.hasSelection').bool().not(),
        value: '_Select a folder'.loc(),
        controlSize: SC.LARGE_CONTROL_SIZE,
        textAlign: SC.ALIGN_CENTER
      })
    }),
    emptyNotice: SC.View.design({
      childViews: ['labelView'],
      layout: { height: 32, centerY: 0 },
      labelView: SC.LabelView.design({
        classNames: ['usage-tip'],
        isVisible: NO,
        isVisibleBinding: SC.Binding.from('Fotofoo.folderController.hasFiles').bool().not(),
        value: '_(empty)'.loc(),
        controlSize: SC.LARGE_CONTROL_SIZE,
        textAlign: SC.ALIGN_CENTER
      })
    }),
    gridView: Fotofoo.LibraryView// .design({
    //       init: function() {
    //         Fotofoo.libraryView = this;
    //         return sc_super();
    //       }
    //     })
  }),

  preview: SC.View.design({
    classNames: ['darkroom'],
    childViews: 'preview controlBar'.w(),

    preview: Fotofoo.Preview.design({
      init: function() {
        Fotofoo.touchUpPreview = this;
        return sc_super();
      }
    }),

    controlBar: SC.View.design({
      classNames: 'control-bar',
      layout: { height: 64, bottom: 0 },
      childViews: 'slider saveButton'.w(),

      slider: SC.SliderView.design({
        layout: {
          width: Fotofoo.MAX_THUMBNAIL_SIZE + 50,
          height: 20, centerX: 0, centerY: 0
        },
        minimum: 10,
        maximum: 100,
        step: 1,
        valueBinding: 'Fotofoo.PREVIEW.sliderValue'
      }),

      saveButton: SC.ButtonView.design({
        layout: { width: 80, top: 20, right: 20 },
        controlSize: SC.REGULAR_CONTROL_SIZE,
        title: '_Save'.loc(),
        isDefault: YES,
        action: 'saveDimensions'
      })
    })
  })

});
