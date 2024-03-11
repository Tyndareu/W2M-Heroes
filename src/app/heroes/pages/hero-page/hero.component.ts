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
  @Input() public heroID!: string;

  public hero = signal<Hero | null>(null);
  public heroForm: FormGroup;

  private readonly formControls = {
    id: '',
    img: '',
    superhero: ['', Validators.required],
    publisher: '',
    alter_ego: '',
    first_appearance: '',
    alt_img: null,
  };

  constructor(
    private readonly heroService: HeroesService,
    private readonly fb: FormBuilder,
    private readonly destroyRef: DestroyRef,
    private readonly router: Router
  ) {
    this.heroForm = this.fb.group(this.formControls);
  }

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
    const formData: Hero = { ...this.heroForm.value };
    formData.superhero = this.toTitleCase(formData.superhero);
    formData.id = this.heroID === 'new' ? crypto.randomUUID() : this.heroID;

    const saveHero$ =
      this.heroID !== 'new'
        ? this.heroService.updateHero(formData)
        : this.heroService.newHero(formData);

    saveHero$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/heroes/heroes-list']),
    });
  }

  public isValidField(field: string): boolean | null {
    const control = this.heroForm.controls[field];
    return control.errors && control.touched;
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

  public resetForm(): void {
    this.heroForm.reset();
    this.heroForm.get('img')?.setValue(this.hero()?.img);
  }

  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }
}
