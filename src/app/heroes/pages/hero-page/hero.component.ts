import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
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
export class HeroComponent {
  /** Service for hero-related operations */
  private readonly _heroService = inject(HeroesService);

  /** Angular FormBuilder for creating reactive forms */
  private readonly _fb = inject(FormBuilder);

  /** Angular Router for navigation */
  private readonly _router = inject(Router);

  /** Required input signal containing the hero ID or 'new' for creating a new hero */
  public heroID = input.required<string>();

  /** Signal containing the current hero data */
  public hero = signal<Hero | null>(null);

  /** Reactive form for hero data input */
  public heroForm: FormGroup;

  /** Form control configuration with validation rules */
  private readonly _formControls = {
    id: '',
    img: '',
    superhero: ['', Validators.required],
    publisher: '',
    alter_ego: '',
    first_appearance: '',
    alt_img: null,
  };

  /**
   * Creates an instance of HeroComponent.
   * @memberof HeroComponent
   */
  constructor() {
    this.heroForm = this._fb.group(this._formControls);
    effect(() => {
      const heroId = this.heroID();
      heroId === 'new' ? this.heroForm.reset() : this.loadHero();
    });
  }

  /**
   * Handles form submission for creating or updating a hero.
   *
   * @return {*}  {void}
   * @memberof HeroComponent
   */
  public onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    const formData: Hero = { ...this.heroForm.value };
    formData.superhero = this._toTitleCase(formData.superhero);
    formData.id = this.heroID() === 'new' ? crypto.randomUUID() : this.heroID();

    const saveHero$ =
      this.heroID() !== 'new'
        ? this._heroService.updateHero(formData)
        : this._heroService.newHero(formData);

    saveHero$.subscribe({
      next: () => this._router.navigate(['/heroes/heroes-list']),
    });
  }

  /**
   * Checks if a form field has validation errors and has been touched by the user.
   *
   * @param {string} field
   * @return {*}  {(boolean | null)}
   * @memberof HeroComponent
   */
  public isValidField(field: string): boolean | null {
    const control = this.heroForm.controls[field];
    return control.errors && control.touched;
  }

  /**
   * Loads hero data from the service and populates the form.
   *
   * @return {*}  {void}
   * @memberof HeroComponent
   */
  public loadHero(): void {
    if (!this.heroID()) {
      return;
    }
    this._heroService
      .selectedHeroWithGetById(this.heroID())
      .pipe(
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

  /**
   * Resets the form to its initial state while preserving the hero's image.
   *
   * @memberof HeroComponent
   */
  public resetForm(): void {
    this.heroForm.reset();
    this.heroForm.get('img')?.setValue(this.hero()?.img);
  }

  /**
   * Converts a string to title case format.
   *
   * @private
   * @param {string} str
   * @return {*}  {string}
   * @memberof HeroComponent
   */
  private _toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }
}
