import {NgModule} from '@angular/core';
import {TestComponentRenderer} from '@angular/core/testing';
import {NativeScriptTestComponentRenderer} from './nativescript_test_component_renderer';
import {COMMON_PROVIDERS} from '../../platform-common';
import {APP_ROOT_VIEW} from '../../platform-providers';
import {topmost} from 'tns-core-modules/ui/frame';
import {View} from 'tns-core-modules/ui/core/view';

/**
 * Get a reference to the root application view.
 */
export function testingRootView(): View {
  return topmost().currentPage.layoutView;
}

/**
 * NativeScript testing support module. Enables use of TestBed for angular components, directives,
 * pipes, and services.
 */
@NgModule({
  providers: [
    COMMON_PROVIDERS,
    {provide: APP_ROOT_VIEW, useFactory: testingRootView},
    {provide: TestComponentRenderer, useClass: NativeScriptTestComponentRenderer},
  ]
})
export class NativeScriptTestingModule {
}
