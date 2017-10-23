import {Injectable} from '@angular/core';
import {TestComponentRenderer} from '@angular/core/testing';
import {topmost} from 'tns-core-modules/ui/frame';
import {LayoutBase} from 'tns-core-modules/ui/layouts/layout-base';
import {AbsoluteLayout} from 'tns-core-modules/ui/layouts/absolute-layout';
import {PercentLength} from 'tns-core-modules/ui/styling/style-properties';

/**
 * A NativeScript based implementation of the TestComponentRenderer.
 */
@Injectable()
export class NativeScriptTestComponentRenderer extends TestComponentRenderer {
  constructor() {
    super();
  }

  insertRootElement(rootElId: string) {
    const page = topmost().currentPage;

    const layout = new AbsoluteLayout();
    layout.id = rootElId;
    layout.width = layout.height = PercentLength.parse('100%');
    AbsoluteLayout.setLeft(layout, 0);
    AbsoluteLayout.setTop(layout, 0);

    const rootLayout = page.layoutView as LayoutBase;
    rootLayout.addChild(layout);
  }

}

