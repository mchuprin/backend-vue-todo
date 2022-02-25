import {Request} from 'express';

export interface RequestAuthedI extends Request {
  user: {
    login: string;
  }
}