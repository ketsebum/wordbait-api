import { Component } from '@angular/core';

@Component({
    selector: 'footercomponent',
    templateUrl: 'app/footer/footer.component.html',
    styleUrls: ['app/footer.css']
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
