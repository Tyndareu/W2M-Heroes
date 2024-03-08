import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { HeroesService } from '../../Services/heroes.service';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    HeroImagePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit {
  @Input() heroID: string | null = null;

  public heroForm: FormGroup = this.fb.group({
    id: [''],
    img: [''],
    superhero: ['', Validators.required],
    publisher: [''],
    alter_ego: [''],
    first_appearance: [''],
    alt_img: [null],
  });

  private destroyRef = inject(DestroyRef);

  constructor(
    private heroService: HeroesService,
    private fb: FormBuilder,
    private readonly _route: Router
  ) {}

  ngOnInit(): void {
    if (this.heroID !== 'new') {
      this.getHero();
    }
  }

  public isValidFiled(field: string): boolean | null {
    return (
      this.heroForm.controls[field].errors &&
      this.heroForm.controls[field].touched
    );
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    if (this.heroID !== 'new') {
      this.heroService.setSelectedHero(this.heroForm.value);
      this.heroService
        .updateHero(this.heroForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this._route.navigate(['/heroes/heroes-list']),
        });
    } else {
      this.heroForm.value.id = crypto.randomUUID();
      console.log(this.heroForm.value);
      this.heroService
        .newHero(this.heroForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this._route.navigate(['/heroes/heroes-list']),
        });
    }
  }

  private getHero(): void {
    this.heroService
      .selectedHeroWithGetById(this.heroID!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: hero => {
          this.heroForm.setValue(hero);
        },
      });
  }
}
