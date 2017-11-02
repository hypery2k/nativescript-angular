import {Inject, Injectable} from '@angular/core';
import {TestComponentRenderer} from '@angular/core/testing';
import {DOCUMENT, ɵgetDOM as getDOM} from '@angular/platform-browser';

/**
 * A NativeScript based implementation of the TestComponentRenderer.
 */
@Injectable()
export class NativeScriptTestComponentRenderer extends TestComponentRenderer {
  constructor(@Inject(DOCUMENT) private _doc: any /** TODO #9100 */) { super(); }

  insertRootElement(rootElId: string) {
    const rootEl = <HTMLElement>getDOM().firstChild(
        getDOM().content(getDOM().createTemplate(`<div id="${rootElId}"></div>`)));

    // TODO(juliemr): can/should this be optional?
    const oldRoots = getDOM().querySelectorAll(this._doc, '[id^=root]');
    for (let i = 0; i < oldRoots.length; i++) {
      getDOM().remove(oldRoots[i]);
    }
    getDOM().appendChild(this._doc.body, rootEl);
  }
}
