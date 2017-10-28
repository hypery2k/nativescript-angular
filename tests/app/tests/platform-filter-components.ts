// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { Component, ElementRef } from "@angular/core";
import { dumpView, createDevice } from "./test-utils";
import { DEVICE } from "nativescript-angular/platform-providers";
import { platformNames } from "platform";
import { nTestBedAfterEach, nTestBedBeforeEach, nTestBedRender } from "nativescript-angular/testing";

@Component({
    template: `
    <StackLayout>
        <ios><Label text="IOS"></Label></ios>
    </StackLayout>`
})
export class IosSpecificComponent {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    template: `
    <StackLayout>
        <android><Label text="ANDROID"></Label></android>
    </StackLayout>`
})
export class AndroidSpecificComponent {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    template: `
    <StackLayout>
        <Label android:text="ANDROID" ios:text="IOS"></Label>
    </StackLayout>`
})
export class PlatformSpecificAttributeComponent {
    constructor(public elementRef: ElementRef) { }
}

xdescribe("Platform filter directives", () => {
    // TODO: Something is different in dumpView. I suspect it has to do with the fact that the old
    // test app class rendered directly into a view container and returned the exact component, whereas
    // testbed appears to return a reference to the root component? Needs investigation.
    describe("on IOS device", () => {
        beforeEach(nTestBedBeforeEach(
            [PlatformSpecificAttributeComponent, AndroidSpecificComponent, IosSpecificComponent],
            [{provide: DEVICE, useValue: createDevice(platformNames.ios)}]
        ));
        afterEach(nTestBedAfterEach());
        it("does render ios specific content", () => {
            return nTestBedRender(IosSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("(Label[text=IOS])") >= 0);
            });
        });
        it("does not render android specific content", () => {
            return nTestBedRender(AndroidSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("Label") < 0);
            });
        });
        it("applies iOS specific attribute", () => {
            return nTestBedRender(PlatformSpecificAttributeComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label[text=IOS])))",
                    dumpView(componentRoot, true));
            });
        });
    });

    describe("on Android device", () => {
        beforeEach(nTestBedBeforeEach(
            [PlatformSpecificAttributeComponent, AndroidSpecificComponent, IosSpecificComponent],
            [{provide: DEVICE, useValue: createDevice(platformNames.android)}]
        ));
        afterEach(nTestBedAfterEach());

        it("does render android specific content", () => {
            return nTestBedRender(AndroidSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("(Label[text=ANDROID])") >= 0);
            });
        });
        it("does not render ios specific content", () => {
            return nTestBedRender(IosSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("Label") < 0);
            });
        });
        it("applies Android specific attribute", () => {
            return nTestBedRender(PlatformSpecificAttributeComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label[text=ANDROID])))",
                    dumpView(componentRoot, true));
            });
        });
    });
});
