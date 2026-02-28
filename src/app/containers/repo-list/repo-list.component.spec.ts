import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { RepoListComponent } from './repo-list.component';
import { loadRepos } from '../../store/repos.actions';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let store: MockStore;

  const stateTemplate = {
    repos: {
      repos: [],
      loading: false,
      error: null,
    },
    theme: 'light' as const,
  };

  describe('with or without repo data', () => {
      beforeEach(async () => {
          await TestBed.configureTestingModule({
              imports: [RepoListComponent],
              providers: [provideMockStore({ initialState: stateTemplate })],
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

      it('should clean up the search subject when onDestroy is called', () => {
          const searchSubject = new Subject<string>();
          const spy = spyOn(searchSubject, 'complete').and.callThrough();

          component['searchSubject'] = searchSubject;
          component.ngOnDestroy();

          expect(spy).toHaveBeenCalled();
      });
  })

  describe('with repo data', () => {
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

      const initialState = {
          ...stateTemplate,
          repos: {
              repos,
              loading: false,
              error: null,
          },
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

      it('should filter repos by search term', () => {
          expect(component.filterRepos(repos, 'react').length).toBe(1);
          expect(component.filterRepos(repos, 'vue').length).toBe(1);
          expect(component.filterRepos(repos, '')).toEqual(repos);
          expect(component.filterRepos(repos, '  ')).toEqual(repos);
      });

      it('should wait 300ms after user input before applying search term filtering', fakeAsync(() => {
          component.onSearch('react');

          tick(299)
          expect(component.filteredRepos().length).toBe(2);

          tick(1);
          expect(component.filteredRepos().length).toBe(1);
      }))
  })
});
