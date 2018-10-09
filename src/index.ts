'use strict';

import Timer = NodeJS.Timer;
import {RequestHandler, Request, Response} from "express";

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

export interface TimeOutMiddlewareOpts {
  ms: number,
  forward: boolean
}

interface TimeoutInfo {
  millisCreatedAt: number,
  timeout: Timer,
  amount: number
}

const container = {
  requestToInfo: new Map<Request, TimeoutInfo>(),
};

const clearReqTimeout = (req: Request) => {
  return () => {
    const info = container.requestToInfo.get(req);
    if (info) {
      clearTimeout(info.timeout);
      container.requestToInfo.delete(req);
    }
  }
};

export type TimeoutCallback = (req: Request, res: Response) => void;

export const timeoutmw = (v: number | TimeOutMiddlewareOpts, fn: TimeoutCallback): RequestHandler => {

  if (typeof fn !== 'function') {
    throw new Error('Bad argument - must be a function.');
  }

  const ms: number = (v as any).ms || v;

  if (!Number.isInteger(ms)) {
    throw new Error('Bad options - "ms" must be an integer representing milliseconds timeout.');
  }

  return (req, res, next) => {

    const info = container.requestToInfo.get(req);

    if (!info) {
      const to = setTimeout(fn, ms);
      container.requestToInfo.set(req, {timeout: to, amount: ms, millisCreatedAt: Date.now()});
      res.once('finish', clearReqTimeout(req));
      return next();
    }

    if ((<any>info.timeout)._called === true) {
      // previous timeout has already been called
      return next();
    }

    if (ms > (info.amount - (Date.now() - info.millisCreatedAt))) {
      // the previously created timeout will happen earlier, so we ignore this timeout
      return next();
    }

    clearTimeout(info.timeout);
    const to = setTimeout(fn, ms);
    res.once('finish', clearReqTimeout(req));
    container.requestToInfo.set(req, {timeout: to, amount: ms, millisCreatedAt: Date.now()});
    next();

  };

};

export default timeoutmw;


