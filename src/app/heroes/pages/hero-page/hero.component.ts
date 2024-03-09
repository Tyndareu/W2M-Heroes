import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    HeroImagePipe,
    MatButtonModule,
    MatCardModule,
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
  @Input() heroID?: string;

  public hero = signal<Hero | null>(null);
  public heroForm: FormGroup = this.fb.group({
    id: [''],
    img: [''],
    superhero: ['', Validators.required],
    publisher: [''],
    alter_ego: [''],
    first_appearance: [''],
    alt_img: [null],
  });

  constructor(
    private heroService: HeroesService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    private readonly _route: Router
  ) {}

  ngOnInit(): void {
    if (this.heroID !== 'new') {
      this.loadHero();
    }
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    const formData = { ...this.heroForm.value };
    formData.superhero = this.toTitleCase(formData.superhero);

    if (this.heroID !== 'new') {
      this.heroService.setSelectedHero(this.heroForm.value);
      this.heroService
        .updateHero(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this._route.navigate(['/heroes/heroes-list']),
        });
    } else {
      this.heroForm.value.id = crypto.randomUUID();
      this.heroService
        .newHero(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this._route.navigate(['/heroes/heroes-list']),
        });
    }
  }

  public isValidFiled(field: string): boolean | null {
    return (
      this.heroForm.controls[field].errors &&
      this.heroForm.controls[field].touched
    );
  }

  public loadHero(): void {
    if (!this.heroID) return;
    this.heroService
      .selectedHeroWithGetById(this.heroID!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(hero => ({
          ...hero,
          superhero: hero.superhero.toUpperCase(),
        }))
      )
      .subscribe({
        next: hero => {
          this.hero.set(hero);
          this.heroForm.setValue(hero);
        },
      });
  }
  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }
}
