import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
	selector: 'app-spinner',
	standalone: true,
	templateUrl: './spinner.component.html',
	styles: `
		:host {
			width: 100%;
			.loading {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 1000;
			}
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass],
})
export class SpinnerComponent {
	loading = input<boolean>(false)
}
