import { createReducer, on } from '@ngrx/store';
import { GitHubRepo } from '../models/repo.model';
import { loadRepos, loadReposSuccess, loadReposFailure } from './repos.actions';

export interface ReposState {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export const initialState: ReposState = {
  repos: [],
  loading: false,
  error: null,
};

export const reposReducer = createReducer(
  initialState,
  on(loadRepos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadReposSuccess, (state, { repos }) => ({
    ...state,
    repos,
    loading: false,
    error: null,
  })),
  on(loadReposFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
