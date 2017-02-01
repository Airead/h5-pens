#!/bin/sh

rsync -avz -e "ssh -p 2222" pens airead@123.56.101.172:www
rsync -avz -e "ssh -p 2222" lib airead@123.56.101.172:www