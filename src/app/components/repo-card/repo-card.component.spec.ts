import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { RepoCardComponent } from './repo-card.component';
import { GitHubRepo } from '../../models/repo.model';

const mockRepo: GitHubRepo = {
  id: 42,
  name: 'awesome-repo',
  full_name: 'octocat/awesome-repo',
  description: 'An awesome repository for testing.',
  html_url: 'https://github.com/octocat/awesome-repo',
  stargazers_count: 12345,
  language: 'TypeScript',
  owner: {
    login: 'octocat',
    avatar_url: 'https://github.com/octocat.png',
    html_url: 'https://github.com/octocat',
  },
};

describe('RepoCardComponent', () => {
  let component: RepoCardComponent;
  let fixture: ComponentFixture<RepoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('repo', mockRepo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display repo full name', () => {
    const el = fixture.nativeElement as HTMLElement;
    const nameEl = el.querySelector('.repo-card__name');
    expect(nameEl?.textContent?.trim()).toBe('octocat/awesome-repo');
  });

  it('should display description', () => {
    const el = fixture.nativeElement as HTMLElement;
    const descEl = el.querySelector('.repo-card__description');
    expect(descEl?.textContent?.trim()).toContain('An awesome repository');
  });

  it('should have link to repo html_url', () => {
    const el = fixture.nativeElement as HTMLElement;
    const link = el.querySelector('a.repo-card') as HTMLAnchorElement;
    expect(link?.href).toBe('https://github.com/octocat/awesome-repo');
    expect(link?.target).toBe('_blank');
  });

  it('should display owner avatar with correct src', () => {
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('.repo-card__avatar') as HTMLImageElement;
    expect(img?.src).toBe('https://github.com/octocat.png');
  });

  it('should display language badge when language is present', () => {
    const el = fixture.nativeElement as HTMLElement;
    const badge = el.querySelector('.repo-card__language');
    expect(badge?.textContent?.trim()).toBe('TypeScript');
  });

  it('should display formatted star count via pipe (e.g. 12.3k)', () => {
    const el = fixture.nativeElement as HTMLElement;
    const starsEl = el.querySelector('.repo-card__stars');
    expect(starsEl?.textContent?.trim()).toContain('12.3k');
  });

  it('should show fallback description when description is null', () => {
    const repoNoDesc = { ...mockRepo, description: null };
    fixture.componentRef.setInput('repo', repoNoDesc);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const descEl = el.querySelector('.repo-card__description');
    expect(descEl?.textContent?.trim()).toContain('No description provided');
  });

  it('should clean up the subscription when onDestroy is called', () => {
    const spy = jasmine.createSpy();

    component['subscription'] = new Subscription(spy);
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
