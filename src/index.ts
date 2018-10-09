'use strict';



import Timer = NodeJS.Timer;

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};


import {RequestHandler, Request} from "express";

export interface TimeOutMiddlewareOpts {
  ms: number,
  forward: boolean
}

interface TimeoutInfo {
  millisCreatedAt: number,
  timeout: Timer
}

const container = {
   requestToInfo: new Map<Request, TimeoutInfo>()
};

export const timeoutmw = (v: TimeOutMiddlewareOpts) : RequestHandler => {


  return (req, res, next) => {

    const info = container.requestToInfo.get(req);

    if(!info){

      const to = setTimeout(() => {
         res.json({error: new Error('time out.')});
      }, v.ms);

      container.requestToInfo.set(req, {timeout: to, millisCreatedAt: Date.now()});
      return next();
    }

    const now = Date.now();



  };


};




export default timeoutmw;


