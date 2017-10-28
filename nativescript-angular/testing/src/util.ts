import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgModule, Type} from '@angular/core';
import {NativeScriptModule} from '../../nativescript.module';
import {platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NS_COMPILER_PROVIDERS} from '../../platform';
import {NATIVESCRIPT_TESTING_PROVIDERS, NativeScriptTestingModule} from '../index';
import {CommonModule} from '@angular/common';

/**
 * Return a promise that resolves after (durationMs) milliseconds
 */
export function promiseWait(durationMs: number) {
    return () => new Promise((resolve) => setTimeout(() => resolve(), durationMs));
}

/**
 * Render a component using the TestBed helper, and return a promise that resolves when the
 * ComponentFixture is fully initialized.
 */
export function nTestBedRender<T>(componentType: Type<T>): Promise<ComponentFixture<T>> {
    const fixture = TestBed.createComponent(componentType);
    fixture.detectChanges();
    return fixture.whenRenderingDone()
    // TODO(jd): it seems that the whenStable and whenRenderingDone utilities of ComponentFixture
    //           do not work as expected. I looked at how to fix it and it's not clear how to provide
    //           a {N} specific subclass, because ComponentFixture is newed directly rather than injected
    // What to do about it? Maybe fakeAsync can help? For now just setTimeout for 100ms (x_X)
        .then(promiseWait(100))
        .then(() => fixture);
}

/**
 * Helper for configuring a TestBed instance for rendering components for test. Ideally this
 * would not be needed, and in truth it's just a wrapper to eliminate some boilerplate. It
 * exists because when you need to specify `entryComponents` for a test the setup becomes quite
 * a bit more complex than if you're just doing a basic component test.
 *
 * More about entryComponents complexity: https://github.com/angular/angular/issues/12079
 *
 * Use:
 * ```
 *   beforeEach(nTestBedBeforeEach([MyComponent,MyFailComponent]));
 * ```
 *
 * **NOTE*** Remember to pair with {@see nTestBedAfterEach}
 *
 * @param components Any components that you will create during the test
 * @param providers Any services your tests depend on
 * @param imports Any module imports your tests depend on
 * @param entryComponents Any entry components that your tests depend on
 */
export function nTestBedBeforeEach(
    components: any[],
    providers: any[] = [],
    imports: any[] = [],
    entryComponents: any[] = []) {
    return (done) => {
        // If there are no entry components we can take the simple path.
        if (entryComponents.length === 0) {
            TestBed.configureTestingModule({
                declarations: [...components],
                providers: [...providers],
                imports: [NativeScriptModule, ...imports]
            });
        }
        else {
            // If there are entry components, we have to reset the testing platform.
            //
            // There's got to be a better way... (o_O)
            TestBed.resetTestEnvironment();
            @NgModule({
                imports: [
                    NativeScriptModule, NativeScriptTestingModule, CommonModule
                ],
                providers: NATIVESCRIPT_TESTING_PROVIDERS,
                exports: entryComponents,
                declarations: entryComponents,
                entryComponents: entryComponents
            })
            class EntryComponentsTestModule {
            }
            TestBed.initTestEnvironment(
                EntryComponentsTestModule,
                platformBrowserDynamicTesting(NS_COMPILER_PROVIDERS)
            );
            TestBed.configureTestingModule({
                declarations: [...components],
                imports: [...imports],
                providers: [...providers],
            });
        }
        TestBed.compileComponents()
            .then(() => done())
            .catch((e) => {
                console.log(`Failed to instantiate test component with error: ${e}`);
                console.log(e.stack);
                done();
            });
    }

}

/**
 * Perform basic TestBed environment initialization. Call this once in the main entry point to your tests.
 */
export function nBasicTestBedInit() {
    TestBed.initTestEnvironment(
        NativeScriptTestingModule,
        platformBrowserDynamicTesting(NS_COMPILER_PROVIDERS)
    );
}

/**
 * Helper for a basic component TestBed clean up.
 * @param resetEnv When true the testing environment will be reset
 * @param resetFn When resetting the environment, use this init function
 */
export function nTestBedAfterEach(resetEnv = true, resetFn = nBasicTestBedInit) {
    return () => {
        TestBed.resetTestingModule();
        if (resetEnv) {
            TestBed.resetTestEnvironment();
            resetFn();
        }
    };
}