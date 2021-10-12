import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Human, Machine } from 'src/app/proto/generated/zitadel/user_pb';

@Component({
  selector: 'cnsl-detail-form-machine',
  templateUrl: './detail-form-machine.component.html',
  styleUrls: ['./detail-form-machine.component.scss'],
})
export class DetailFormMachineComponent implements OnInit, OnDestroy {
  @Input() public username!: string;
  @Input() public user!: Human.AsObject | Machine.AsObject;
  @Input() public disabled: boolean = false;
  @Output() public submitData: EventEmitter<any> = new EventEmitter<any>();

  public machineForm!: FormGroup;

  private sub: Subscription = new Subscription();

  constructor(private fb: FormBuilder) {
    this.machineForm = this.fb.group({
      userName: [{ value: '', disabled: true }, [Validators.required]],
      name: [{ value: '', disabled: this.disabled }, Validators.required],
      description: [{ value: '', disabled: this.disabled }],
    });
  }

  public ngOnInit(): void {
    this.machineForm.patchValue({ ...this.user, userName: this.username });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public submitForm(): void {
    this.submitData.emit(this.machineForm.value);
  }

  public get name(): AbstractControl | null {
    return this.machineForm.get('name');
  }

  public get description(): AbstractControl | null {
    return this.machineForm.get('description');
  }

  public get userName(): AbstractControl | null {
    return this.machineForm.get('userName');
  }
}
