import {Component, Input} from '@angular/core';
import styling from './calendar-day.scss';
import template from './calendar-day.html';

@Component({
    selector: 'adg-calendar-day',
    styles: [styling],
    template
})
export class CalendarDayComponent {
    @Input('day-vm') dayVM;

    ngOnChanges(changes) {
        if (changes['dayVM']) {
            changes.dayVM.currentValue.styles = {
                isMagnified: changes.dayVM.currentValue.isSelected
            };
            this.day = changes.dayVM.currentValue;
            if (changes.dayVM.currentValue.styles.isMagnified === true) {
                setTimeout(() => {
                    this.day.styles.isMagnified = false;
                }, 1500);
            }
        }
    }
}