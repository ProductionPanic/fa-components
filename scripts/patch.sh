#!/bin/bash
THISSCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR=$THISSCRIPTDIR/..
cd $ROOTDIR
echo "Patching..."
git add .
git commit -m $@
git push
echo "Done."
