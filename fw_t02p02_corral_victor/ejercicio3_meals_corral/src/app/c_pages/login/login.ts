import { AuthService } from './../../services/auth-service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { User } from '../../model/user';
import { StorageService } from '../../services/storage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private localStorageService = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup;
  public loginForm: FormGroup;
  public registroExitoso = false;
  public submitted = false;
  //controla cuándo empezar a mostrar la validación visual

  public errorRegistro = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            this.emailDominioEduValidator,
            this.emailUnicoValidator.bind(this),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
      },
      { validators: this.passwordsCoinciden.bind(this) },
    );
    this.loginForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(3)]]
      }
    )
  }

  ngOnInit() {
    if (this.authService.sessionActive()) {
      this.router.navigate(["/"]);
    }
  }

  //Usa this internamente y para que no pierda el contexto usamos bind
  //Otra solución es usar una función flecha
  public emailUnicoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const emailExiste = this.localStorageService.existeEmail(control.value);
    return emailExiste ? { emailDuplicado: true } : null;
  }

  //No usa this internamente, no necesitamos bind.
  //Se recomienda usar bind por si hubiera cambios: this.emailDominioEduValidator.bind(this)
  public emailDominioEduValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    const dominioValido = email.endsWith('@educastillalamancha.es');
    return dominioValido ? null : { dominioInvalido: true };
  }

  public passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNoCoinciden: true };
  }

  public get nombreCompleto() {
    return this.registerForm.get('nombreCompleto');
  }
  public get email() {
    return this.registerForm.get('email');
  }
  public get password() {
    return this.registerForm.get('password');
  }
  public get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  public get emailLogin() {
    return this.loginForm.get('email');
  }
  public get passwordLogin() {
    return this.loginForm.get('password');
  }


  public onLogin() {
    const email = this.emailLogin?.value;
    console.log(email);
    const pass = this.passwordLogin?.value;
    console.log(pass);
    this.authService.login(email, pass);
    if (this.authService.sessionActive()) {
      this.router.navigate(["/"])
    } else {
      console.log("Login INcorrecto")
    }
  }

  public onRegister() {
    this.submitted = true;
    this.errorRegistro = '';

    if (this.registerForm.valid) {
      const nuevoUsuario: User = {
        id: this.localStorageService.nextUserId(),
        name: this.registerForm.value.nombreCompleto,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      const success = this.localStorageService.registerUser(nuevoUsuario);

      if (success) {
        this.registroExitoso = true;
        this.registerForm.reset();
        this.submitted = false;
      } else {
        //alert('Error al registrar el usuario');
        this.errorRegistro = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
      }
    }
  }

  public irALogin() {
    this.registroExitoso = false;
    this.errorRegistro = '';
    const loginTab = document.getElementById('login-tab') as HTMLElement;
    loginTab?.click();
    //Si quieres ir al index (/) o a cualquier ruta, hazlo con Router.
  }

  public getValidationClass(control: AbstractControl | null): string {
    //NO mostrar validación hasta que el usuario envíe
    if (!this.submitted) {
      return '';
    }

    //Mi los controles de forma individual.
    if (!control) {
      return '';
    }
    if (control.valid) {
      return 'is-valid';
    }

    return 'is-invalid';
  }
  public getValidationClassConfirmPassword(): string {
    if (!this.submitted) {
      return '';
    }

    if (!this.confirmPassword) {
      return '';
    }

    // Primero verifico si el control tiene errores propios
    if (this.confirmPassword.errors) {
      return 'is-invalid';
    }

    // Luego verifico si el formulario tiene errores propios
    if (this.registerForm.errors?.['passwordsNoCoinciden']) {
      return 'is-invalid';
    }

    return 'is-valid';
  }
}
