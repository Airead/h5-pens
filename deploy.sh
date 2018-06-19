#!/bin/sh

rsync -avz -e "ssh -p 22" pens airead@www.i64.top:www
rsync -avz -e "ssh -p 22" lib airead@www.i64.top:www
