/**
 * Created by ketse on 3/1/17.
 */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterComponent} from './footer.component';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a year', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app.year).toBeTruthy();
    });

    it('should have be year', () => {
        const app = fixture.debugElement.componentInstance;
        let today = new Date();
        expect(app.year === today.getFullYear()).toBeTruthy();
    });

    it('should display this year', () => {
        let app = fixture.debugElement.nativeElement;
        let today = new Date();
        expect(app.querySelector('#footer').textContent).toContain(today.getFullYear());
    });
});
