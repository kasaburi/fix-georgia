import { ComponentFixture, TestBed } from '@angular/core/testing';

import { page } from './page';

describe('page', () => {
  let component: page;
  let fixture: ComponentFixture<page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [page],
    }).compileComponents();

    fixture = TestBed.createComponent(page);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
