import {NgModule} from '@angular/core';
import {TestComponentRenderer} from '@angular/core/testing';
import {NativeScriptTestComponentRenderer} from './nativescript_test_component_renderer';

/**
 * NgModule for testing.
 *
 * @stable
 */
@NgModule({
  providers: [
    {provide: TestComponentRenderer, useClass: NativeScriptTestComponentRenderer},
  ]
})
export class NativeScriptTestingModule {
}
