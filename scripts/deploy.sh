#!/bin/bash
#Based on : https://gist.github.com/domenic/ec8b0fc8ab45f39403dd

set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
COMMIT_AUTHOR_EMAIL="travis@nobody.fr"
KEYFILE="$TRAVIS_BUILD_DIR/keys/deploy_key"

#Generate a key in needed that will be store in cache (and to be haded to github)
if [ ! -f $KEYFILE ]; then
    ssh-keygen -t rsa -b 4096 -C "$COMMIT_AUTHOR_EMAIL"  -N "$TMPPASS" -f $KEYFILE
fi
cat "$KEYFILE.pub"

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy of gh-pages."
    exit 0
fi

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all .
git commit -m "Deploy to GitHub Pages: ${TRAVIS_COMMIT}"

chmod 600 $KEYFILE
eval `ssh-agent -s`
#echo "$TMPPASS" | ssh-add -p $KEYFILE
expect << EOF
  spawn ssh-add $KEYFILE
  expect "Enter passphrase"
  send "$TMPPASS\r"
  expect eof
EOF
# Now that we're all set up, we can push.
git push git@github.com:adentes-org/SOFIA.git $TARGET_BRANCH  || echo "git push to gh-pages erro"
