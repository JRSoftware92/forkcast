import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { selectRepos, selectLoading, selectError } from '../../store/repos.selectors';
import { selectIsDarkTheme } from '../../store/theme.selectors';
import { loadRepos } from '../../store/repos.actions';
import { toggleTheme } from '../../store/theme.actions';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RepoCardComponent } from '../../components/repo-card/repo-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';
import { GitHubRepo } from '../../models/repo.model';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBarComponent,
    RepoCardComponent,
    SkeletonCardComponent,
  ],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss',
})
export class RepoListComponent implements OnInit {
  private store = inject(Store);

  repos = this.store.selectSignal(selectRepos);
  loading = this.store.selectSignal(selectLoading);
  error = this.store.selectSignal(selectError);
  isDarkTheme = this.store.selectSignal(selectIsDarkTheme);

  searchTerm = signal('');

  filteredRepos = computed(() => this.filterRepos(this.repos(), this.searchTerm()));

  skeletonCount = Array.from({ length: 12 }, (_, i) => i);

  ngOnInit(): void {
    this.store.dispatch(loadRepos({}));
  }

  onSearch(query: string): void {
    this.searchTerm.set(query);
    this.store.dispatch(loadRepos({ query: query || undefined }));
  }

  onThemeToggle(): void {
    this.store.dispatch(toggleTheme());
  }

  onRetry(): void {
    this.store.dispatch(loadRepos({ query: this.searchTerm() || undefined }));
  }

  filterRepos(repos: GitHubRepo[], term: string): GitHubRepo[] {
    if (!term?.trim()) return repos;
    const lower = term.toLowerCase().trim();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.full_name.toLowerCase().includes(lower) ||
        (r.description?.toLowerCase().includes(lower) ?? false) ||
        r.owner.login.toLowerCase().includes(lower)
    );
  }
}
