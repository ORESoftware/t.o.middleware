#!/usr/bin/env node

const cp = require('child_process');
const path  = require('path');
const fs  = require('fs');
const http  = require('http');
const assert  = require('assert');
const EE  = require('events');
const strm = require('stream');



const to = setTimeout(() => {
  
  console.log(to._called);
  
}, 10);

console.log(to._called);
