import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Naxva } from './naxva';

describe('Naxva', () => {
  let component: Naxva;
  let fixture: ComponentFixture<Naxva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Naxva],
    }).compileComponents();

    fixture = TestBed.createComponent(Naxva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
