import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loginpop } from './loginpop';

describe('Loginpop', () => {
  let component: Loginpop;
  let fixture: ComponentFixture<Loginpop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loginpop],
    }).compileComponents();

    fixture = TestBed.createComponent(Loginpop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
