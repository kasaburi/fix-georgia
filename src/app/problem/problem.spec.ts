import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem } from './problem';

describe('Problem', () => {
  let component: Problem;
  let fixture: ComponentFixture<Problem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Problem],
    }).compileComponents();

    fixture = TestBed.createComponent(Problem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
