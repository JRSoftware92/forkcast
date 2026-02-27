import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RepoListComponent } from './repo-list.component';
import { reposReducer } from '../../store/repos.reducer';
import { themeReducer } from '../../store/theme.reducer';
import { loadRepos } from '../../store/repos.actions';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let store: MockStore;

  const initialState = {
    repos: {
      repos: [],
      loading: false,
      error: null,
    },
    theme: 'light' as const,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoListComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadRepos on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadRepos({}));
  });

  it('should no longer dispatch loadRepos with query when onSearch is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onSearch('angular');
    expect(dispatchSpy).not.toHaveBeenCalledWith(loadRepos({ query: 'angular' }));
  });

  it('should dispatch loadRepos when onRetry is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onRetry();
    expect(dispatchSpy).toHaveBeenCalledWith(loadRepos({ query: undefined }));
  });

  it('should filter repos by search term', () => {
    const repos = [
      {
        id: 1,
        name: 'react',
        full_name: 'facebook/react',
        description: 'A lib',
        html_url: 'https://github.com/facebook/react',
        stargazers_count: 100000,
        language: 'JavaScript',
        owner: { login: 'facebook', avatar_url: '', html_url: '' },
      },
      {
        id: 2,
        name: 'vue',
        full_name: 'vuejs/vue',
        description: 'Vue framework',
        html_url: 'https://github.com/vuejs/vue',
        stargazers_count: 50000,
        language: 'JavaScript',
        owner: { login: 'vuejs', avatar_url: '', html_url: '' },
      },
    ];
    expect(component.filterRepos(repos, 'react').length).toBe(1);
    expect(component.filterRepos(repos, 'vue').length).toBe(1);
    expect(component.filterRepos(repos, '')).toEqual(repos);
    expect(component.filterRepos(repos, '  ')).toEqual(repos);
  });
});
