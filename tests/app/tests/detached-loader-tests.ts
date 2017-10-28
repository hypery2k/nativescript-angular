// make sure you import mocha-config before @angular/core
import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {DetachedLoader} from 'nativescript-angular/common/detached-loader';
import {nTestBedAfterEach, nTestBedBeforeEach, nTestBedRender} from 'nativescript-angular/testing';

@Component({
    template: `<StackLayout><Label text="COMPONENT"></Label></StackLayout>`
})
class TestComponent { }


class LoaderComponentBase {
    @ViewChild(DetachedLoader) public loader: DetachedLoader;

    public ready: Promise<LoaderComponentBase>;
    private resolve;
    constructor() {
        this.ready = new Promise((reslove, reject) => {
            this.resolve = reslove;
        });
    }
    ngAfterViewInit() {
        console.log("!!! ngAfterViewInit -> loader: " + this.loader);
        this.resolve(this);
    }
}

@Component({
    selector: "loader-component-on-push",
    template: `
    <StackLayout>
        <DetachedContainer #loader></DetachedContainer>
    </StackLayout>
    `
})
export class LoaderComponent extends LoaderComponentBase {}

@Component({
    selector: "loader-component-on-push",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <StackLayout>
        <DetachedContainer #loader></DetachedContainer>
    </StackLayout>
    `
})
export class LoaderComponentOnPush extends LoaderComponentBase { }

// TODO(JD): These tests should work, but demonstrate an annoying bug I've noticed sometimes with @ViewChild
//
// The @ViewChild(DetachedLoader) on LoaderComponentBase fails. Can anyone shed some light on why?
xdescribe("DetachedLoader", () => {

    beforeEach(nTestBedBeforeEach([LoaderComponent, LoaderComponentOnPush], [], [], [TestComponent]));
    afterEach(nTestBedAfterEach());

    it("creates component", (done) => {
        let component: LoaderComponent;

        nTestBedRender(LoaderComponent)
            .then((fixture) => {
                component = fixture.componentRef.instance;
                return component.ready;
            })
            .then(() => component.loader.loadComponent(TestComponent))
            .then(() => done())
            .catch(done);
    });


    it("creates component when ChangeDetectionStrategy is OnPush", (done) => {
        nTestBedRender(LoaderComponentOnPush)
            .then((fixture) => {
                const component: LoaderComponent = fixture.componentRef.instance;
                return component.loader.loadComponent(TestComponent);
            })
            .then(() => done())
            .catch(done);
    });
});
