import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptivePlayerComponent } from './adaptive-player.component';

describe('AdaptivePlayerComponent', () => {
  let component: AdaptivePlayerComponent;
  let fixture: ComponentFixture<AdaptivePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptivePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptivePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
