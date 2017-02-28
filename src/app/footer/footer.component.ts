import { Component } from '@angular/core';

@Component({
    selector: 'footercomponent',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent {
    year: number;

    ngOnInit() {
        this.copyRightYear();
    }

    copyRightYear() {
        let today = new Date();
        this.year = today.getFullYear();
    }
}
